import React, { useState } from 'react';
import { StartupReport } from '../types/startup';
import { X, Download, Loader2, Presentation, AlertCircle } from 'lucide-react';
import { generateStartupReportPdf } from '../utils/pdfReport';

interface PdfExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StartupReport;
}

export const PdfExportPreviewModal: React.FC<PdfExportPreviewModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    setError('');
    try {
      await generateStartupReportPdf(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate the PDF report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div id="pdf-export-modal" className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Startup Validation Report</h3>
              <p className="text-xs text-slate-500">Generate executive PDF dossier or slide blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Print/PDF Export Option */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Complete Validation Report (PDF)</h4>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Downloads a formatted multi-page dossier containing all five analysis sections, scores, SWOT, financials, and pitch outline.
              </p>
            </div>
            <button
              id="btn-print-executive-pdf"
              onClick={handleDownload}
              disabled={isGenerating}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</span>
              ) : 'Download PDF'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pitch Deck Generator Extension Point */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Auto-Generate 12-Slide Pitch Deck (.PPTX)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connects directly to the Investment Advisor slide blueprint to export editable presentation slides.
              </p>
            </div>
            <button
              disabled
              className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 font-semibold cursor-not-allowed border border-slate-200"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
