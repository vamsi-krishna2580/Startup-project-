import sys
import json
import asyncio
from typing import Dict, Any
from ..tools.registry import tool_registry

class MCPServer:
    """
    Model Context Protocol (MCP) Stdio Server.
    Exposes startup validation tools to MCP clients (Claude Code, Cursor, Windsurf, etc.).
    """

    TOOLS_MANIFEST = [
        {
            "name": "calculator",
            "description": "Evaluate arithmetic expressions deterministically.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Mathematical formula, e.g. '120000 / 12'"}
                },
                "required": ["expression"]
            }
        },
        {
            "name": "financial_calculator",
            "description": "Calculate unit economics, break-even, runway, or 4-year timeline projections.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "calculation_type": {"type": "string", "enum": ["unit_economics", "break_even", "runway", "projections"]},
                    "price_per_unit": {"type": "number"},
                    "variable_cost_per_unit": {"type": "number"},
                    "monthly_fixed_costs": {"type": "number"},
                    "monthly_burn_rate": {"type": "number"},
                    "year_1_revenue": {"type": "number"},
                    "year_1_costs": {"type": "number"}
                },
                "required": ["calculation_type"]
            }
        },
        {
            "name": "scoring",
            "description": "Compute deterministic opportunity or investment readiness scores (0-100).",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "score_type": {"type": "string", "enum": ["opportunity", "investment_readiness"]},
                    "problem_severity": {"type": "number"},
                    "solution_innovation": {"type": "number"},
                    "market_tam_score": {"type": "number"},
                    "defensibility_moat": {"type": "number"},
                    "timing_catalyst": {"type": "number"}
                },
                "required": ["score_type"]
            }
        }
    ]

    @classmethod
    async def handle_request(cls, req: Dict[str, Any]) -> Dict[str, Any]:
        req_id = req.get("id")
        method = req.get("method")
        params = req.get("params", {})

        if method == "tools/list":
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"tools": cls.TOOLS_MANIFEST}
            }

        elif method == "tools/call":
            name = params.get("name")
            arguments = params.get("arguments", {})

            if name == "calculator":
                res = tool_registry.TOOLS["calculator"].execute(arguments.get("expression", "0"))
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {"content": [{"type": "text", "text": json.dumps(res)}]}
                }

            elif name == "financial_calculator":
                calc_type = arguments.get("calculation_type")
                if calc_type == "break_even":
                    res = tool_registry.TOOLS["financial_calculator"].calculate_break_even(
                        monthly_fixed_costs=arguments.get("monthly_fixed_costs", 10000),
                        price_per_unit=arguments.get("price_per_unit", 100),
                        variable_cost_per_unit=arguments.get("variable_cost_per_unit", 20)
                    )
                elif calc_type == "runway":
                    res = tool_registry.TOOLS["financial_calculator"].calculate_runway_and_funding(
                        monthly_burn_rate=arguments.get("monthly_burn_rate", 20000)
                    )
                else:
                    res = tool_registry.TOOLS["financial_calculator"].generate_projections(
                        year_1_revenue=arguments.get("year_1_revenue", 100000),
                        year_1_costs=arguments.get("year_1_costs", 250000)
                    )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {"content": [{"type": "text", "text": json.dumps(res)}]}
                }

            elif name == "scoring":
                st = arguments.get("score_type")
                if st == "opportunity":
                    res = tool_registry.TOOLS["scoring"].calculate_opportunity_score(
                        problem_severity=arguments.get("problem_severity", 7),
                        solution_innovation=arguments.get("solution_innovation", 7),
                        market_tam_score=arguments.get("market_tam_score", 7),
                        defensibility_moat=arguments.get("defensibility_moat", 7),
                        timing_catalyst=arguments.get("timing_catalyst", 7)
                    )
                else:
                    res = tool_registry.TOOLS["scoring"].calculate_investment_readiness(
                        unit_economics_score=arguments.get("unit_economics_score", 7),
                        execution_feasibility=arguments.get("execution_feasibility", 7),
                        defensibility_moat=arguments.get("defensibility_moat", 7),
                        traction_evidence=arguments.get("traction_evidence", 7),
                        market_tailwinds=arguments.get("market_tailwinds", 7)
                    )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {"content": [{"type": "text", "text": json.dumps(res)}]}
                }

            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Tool '{name}' not found"}
            }

        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method '{method}' not implemented"}
        }

    @classmethod
    async def run_stdio(cls):
        """Run standard stdio JSON-RPC loop"""
        reader = asyncio.StreamReader()
        protocol = asyncio.StreamReaderProtocol(reader)
        await asyncio.get_event_loop().connect_read_pipe(lambda: protocol, sys.stdin)

        while True:
            line = await reader.readline()
            if not line:
                break
            try:
                req = json.loads(line.decode("utf-8"))
                resp = await cls.handle_request(req)
                sys.stdout.write(json.dumps(resp) + "\n")
                sys.stdout.flush()
            except Exception as e:
                sys.stderr.write(f"Error handling MCP request: {e}\n")

if __name__ == "__main__":
    asyncio.run(MCPServer.run_stdio())
