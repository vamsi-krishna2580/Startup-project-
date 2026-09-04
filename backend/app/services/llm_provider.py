import asyncio
import os
import json
import re
from typing import Dict, Any, Optional
from ..config import settings

class LLMConfigurationError(Exception):
    """Raised when an LLM provider is requested but missing its required API key or configuration."""
    pass

class LLMExecutionError(Exception):
    """Raised when the LLM provider fails to execute or returns unparseable content."""
    pass

class LLMProvider:
    """
    Abstract LLM Provider interface.
    Dispatches to Gemini, OpenAI, Anthropic, or Ollama based on environment configuration.
    """

    @classmethod
    def clean_json_response(cls, raw_text: str) -> Dict[str, Any]:
        """
        Robust JSON extractor that handles markdown code blocks, backticks, and whitespace.
        """
        text = raw_text.strip()
        # Remove ```json ... ``` or ``` ... ``` wrappers
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if match:
                text = match.group(1).strip()

        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start:end+1]

        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            # Simple escape fixing
            fixed = re.sub(r'\\(?![/"\\bfnrtu])', r'\\\\', text)
            try:
                return json.loads(fixed)
            except Exception:
                raise LLMExecutionError(f"Failed to parse LLM structured response as JSON: {str(e)}\nRaw: {raw_text[:200]}...")

    @classmethod
    async def generate_json(cls, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        provider = settings.LLM_PROVIDER.lower()

        if provider == "gemini":
            return await cls._call_gemini(prompt, system_instruction)
        elif provider in ("openai", "openai-compatible"):
            return await cls._call_openai(prompt, system_instruction)
        elif provider == "anthropic":
            return await cls._call_anthropic(prompt, system_instruction)
        elif provider == "ollama":
            return await cls._call_ollama(prompt, system_instruction)
        else:
            raise LLMConfigurationError(f"Unsupported LLM_PROVIDER '{provider}'. Supported: gemini, openai, anthropic, ollama.")

    @classmethod
    async def _post_json(
        cls,
        provider_name: str,
        url: str,
        payload: Dict[str, Any],
        headers: Optional[Dict[str, str]] = None,
        timeout: Optional[float] = None,
    ):
        """POST to an LLM provider and normalize transport failures."""
        import httpx

        request_timeout = timeout or settings.LLM_TIMEOUT_SECONDS
        attempts = settings.LLM_MAX_RETRIES + 1
        last_error: Optional[Exception] = None

        for attempt in range(attempts):
            try:
                async with httpx.AsyncClient(timeout=request_timeout) as client:
                    response = await client.post(url, headers=headers, json=payload)

                if response.status_code not in {429, 500, 502, 503, 504} or attempt == attempts - 1:
                    return response

                retry_after = response.headers.get("Retry-After")
                delay = float(retry_after) if retry_after and retry_after.isdigit() else 1.5 * (2 ** attempt)
                await asyncio.sleep(min(delay, 8.0))
            except (httpx.TimeoutException, httpx.RequestError) as exc:
                last_error = exc
                if attempt == attempts - 1:
                    break
                await asyncio.sleep(min(1.5 * (2 ** attempt), 8.0))

        if isinstance(last_error, httpx.TimeoutException):
            raise LLMExecutionError(
                f"{provider_name} timed out after {request_timeout:g} seconds "
                f"across {attempts} attempt(s). Retry later or select Demo mode."
            ) from last_error
        if last_error is not None:
            raise LLMExecutionError(
                f"Could not reach {provider_name} after {attempts} attempt(s): "
                f"{type(last_error).__name__}. Check the internet connection."
            ) from last_error
        raise LLMExecutionError(f"{provider_name} request failed without a response.")

    @classmethod
    async def _call_gemini(cls, prompt: str, system_instruction: Optional[str]) -> Dict[str, Any]:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise LLMConfigurationError(
                "GEMINI_API_KEY is not configured in backend environment. "
                "Please configure GEMINI_API_KEY in your .env or system environment."
            )

        model_name = settings.LLM_MODEL or "gemini-2.5-flash"
        
        # We can call the Google Gemini REST API using httpx
        import httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

        contents = []
        if system_instruction:
            contents.append({
                "role": "user",
                "parts": [{"text": f"SYSTEM DIRECTIVE:\n{system_instruction}\n\nPlease output valid JSON only."}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": "Understood. I will strictly output valid JSON adhering to your schema."}]
            })

        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.3,
                "responseMimeType": "application/json"
            }
        }

        resp = await cls._post_json("Gemini", url, payload)
        if resp.status_code != 200:
            raise LLMExecutionError(f"Gemini API returned status {resp.status_code}: {resp.text}")

        data = resp.json()
        try:
            candidates = data.get("candidates", [])
            if not candidates:
                raise LLMExecutionError("Gemini returned empty candidate list.")
            text_part = candidates[0]["content"]["parts"][0]["text"]
            return cls.clean_json_response(text_part)
        except (KeyError, IndexError) as e:
            raise LLMExecutionError(f"Malformed response structure from Gemini: {str(e)}")

    @classmethod
    async def _call_openai(cls, prompt: str, system_instruction: Optional[str]) -> Dict[str, Any]:
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise LLMConfigurationError("OPENAI_API_KEY is not configured in backend environment.")

        model_name = settings.LLM_MODEL or "gpt-4o-mini"
        import httpx
        url = "https://api.openai.com/v1/chat/completions"

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": model_name,
            "messages": messages,
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        resp = await cls._post_json("OpenAI", url, payload, headers=headers)
        if resp.status_code != 200:
            raise LLMExecutionError(f"OpenAI API returned status {resp.status_code}: {resp.text}")

        data = resp.json()
        raw_text = data["choices"][0]["message"]["content"]
        return cls.clean_json_response(raw_text)

    @classmethod
    async def _call_anthropic(cls, prompt: str, system_instruction: Optional[str]) -> Dict[str, Any]:
        api_key = settings.ANTHROPIC_API_KEY
        if not api_key:
            raise LLMConfigurationError("ANTHROPIC_API_KEY is not configured in backend environment.")

        model_name = settings.LLM_MODEL or "claude-3-5-sonnet-20241022"
        import httpx
        url = "https://api.anthropic.com/v1/messages"

        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        system_text = system_instruction or "You are an expert venture capital startup validator. Output valid JSON only."
        payload = {
            "model": model_name,
            "max_tokens": 4096,
            "system": system_text,
            "messages": [{"role": "user", "content": f"{prompt}\n\nRespond with valid JSON only."}],
            "temperature": 0.3
        }

        resp = await cls._post_json("Anthropic", url, payload, headers=headers)
        if resp.status_code != 200:
            raise LLMExecutionError(f"Anthropic API returned status {resp.status_code}: {resp.text}")

        data = resp.json()
        raw_text = data["content"][0]["text"]
        return cls.clean_json_response(raw_text)

    @classmethod
    async def _call_ollama(cls, prompt: str, system_instruction: Optional[str]) -> Dict[str, Any]:
        base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        model_name = settings.LLM_MODEL or "llama3"

        import httpx
        url = f"{base_url}/api/chat"

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model_name,
            "messages": messages,
            "format": "json",
            "stream": False
        }

        resp = await cls._post_json("Ollama", url, payload)
        if resp.status_code != 200:
            raise LLMExecutionError(f"Ollama returned status {resp.status_code}: {resp.text}")

        data = resp.json()
        raw_text = data["message"]["content"]
        return cls.clean_json_response(raw_text)
