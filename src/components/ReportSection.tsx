import React from 'react';

interface ReportSectionProps {
  id: string;
  agentNumber: string;
  agentName: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'emerald' | 'blue' | 'amber';
  children: React.ReactNode;
  className?: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  id,
  agentNumber,
  agentName,
  title,
  subtitle,
  badgeText,
  badgeVariant = 'default',
  children,
  className = ''
}) => {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id={id} className={`space-y-6 pt-2 scroll-mt-24 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-700 uppercase tracking-wider">
              AGENT {agentNumber}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {agentName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {badgeText && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${getBadgeStyle()}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
};
