import React, { useState, useMemo } from 'react';
import { copyToClipboard, downloadJsonFile } from '../utils/formatters';
import { Copy, Check, Download, Search, Code, CheckCircle2 } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
  filename?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  filename = 'startup-validation-report.json'
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const jsonString = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonString);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadJsonFile(data, filename);
  };

  // Basic syntax colorizer for JSON string
  const highlightedHtml = useMemo(() => {
    if (!jsonString) return '';
    // Escape HTML special characters
    const escaped = jsonString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Regex for syntax highlighting
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber-600'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-indigo-600 font-semibold'; // key
          } else {
            cls = 'text-emerald-700'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-blue-600 font-bold'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-slate-400 italic'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }, [jsonString]);

  return (
    <div id="json-viewer-container" className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Header with technical info and action buttons */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              TECHNICAL PAYLOAD
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
              application/json
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-600" />
            Structured Consolidated Schema
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-json-search"
              type="text"
              placeholder="Filter keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-44 font-mono"
            />
          </div>

          <button
            id="btn-copy-json"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Copy entire JSON to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            id="btn-download-json"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-2xs cursor-pointer"
            title="Download report JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Body */}
      <div className="p-4 bg-slate-900 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-200 leading-relaxed select-text">
        <pre
          className="whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <span>Encoding: UTF-8 • Strict JSON Standard RFC 8259</span>
        <span>Size: ~{(jsonString.length / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
};
