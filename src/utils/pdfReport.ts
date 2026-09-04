import { StartupReport } from '../types/startup';

const printable = (value: unknown): string => String(value ?? '')
  .replace(/[–—]/g, '-')
  .replace(/•/g, '-')
  .replace(/[^\x20-\x7E\n]/g, '');

export async function generateStartupReportPdf(report: StartupReport): Promise<string> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 18) {
      pdf.addPage();
      y = 18;
    }
  };

  const heading = (title: string, size = 15) => {
    ensureSpace(size * 0.6 + 5);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(size);
    pdf.setTextColor(30, 64, 175);
    pdf.text(printable(title), margin, y);
    y += size * 0.45 + 3;
  };

  const paragraph = (text: unknown, indent = 0) => {
    const lines = pdf.splitTextToSize(printable(text), contentWidth - indent);
    const height = Math.max(1, lines.length) * 5;
    ensureSpace(height + 2);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59);
    pdf.text(lines, margin + indent, y);
    y += height + 2;
  };

  const field = (label: string, value: unknown) => {
    ensureSpace(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${printable(label)}:`, margin, y);
    y += 5;
    paragraph(value, 2);
  };

  const list = (label: string, values: unknown[] | undefined) => {
    if (!values?.length) return;
    heading(label, 11);
    values.forEach((value) => paragraph(`- ${printable(value)}`, 2));
  };

  pdf.setFillColor(30, 64, 175);
  pdf.rect(0, 0, pageWidth, 34, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(21);
  pdf.text('AI Startup Validation Report', margin, 16);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Generated ${new Date().toLocaleString()} | Source: ${printable(report.source || 'api')}`, margin, 25);
  y = 43;

  heading('Startup Idea', 16);
  paragraph(report.idea);
  field('Opportunity Score', `${report.startup_analysis.opportunity_score}/100`);
  field('Investment Readiness', `${report.investment_report.investment_readiness_score}/100`);
  field('Recommended Funding Stage', report.investment_report.recommended_funding_stage);
  field('Final Verdict', report.investment_report.final_verdict);

  heading('1. Executive & Startup Analysis');
  field('Executive Summary', report.investment_report.executive_summary);
  field('Elevator Pitch', report.investment_report.elevator_pitch);
  field('Problem', report.startup_analysis.problem);
  field('Solution', report.startup_analysis.solution);
  field('Innovation', report.startup_analysis.innovation);
  list('Strengths', report.startup_analysis.strengths);
  list('Weaknesses', report.startup_analysis.weaknesses);
  list('Risks', report.startup_analysis.risks);
  list('Recommendations', report.startup_analysis.suggestions);

  heading('2. Market Research');
  field('Market Size', report.market_research.market_size);
  field('Market Demand', report.market_research.market_demand);
  list('Target Customers', report.market_research.target_customers);
  list('Industry Trends', report.market_research.industry_trends);
  list('Market Opportunities', report.market_research.market_opportunities);
  list('Market Challenges', report.market_research.market_challenges);

  heading('3. Business Strategy');
  field('Business Model', report.business_strategy.business_model);
  field('Revenue Model', report.business_strategy.revenue_model);
  field('Pricing Strategy', report.business_strategy.pricing_strategy);
  field('Unique Value Proposition', report.business_strategy.unique_value_proposition);
  field('Go-To-Market', report.business_strategy.go_to_market_strategy);
  field('Growth Strategy', report.business_strategy.growth_strategy);
  list('Customer Acquisition', report.business_strategy.customer_acquisition);
  list('Sales Channels', report.business_strategy.sales_channels);
  list('Partnerships', report.business_strategy.partnerships);

  heading('4. Financial Plan');
  field('Startup Cost', report.financial_plan.startup_cost_estimate);
  field('Operating Costs', report.financial_plan.operating_costs);
  field('Revenue Projection', report.financial_plan.revenue_projection);
  field('Break-Even', report.financial_plan.break_even_estimate);
  field('Funding Required', report.financial_plan.funding_required);
  field('Funding Utilization', report.financial_plan.funding_utilization);
  field('Profitability Potential', report.financial_plan.profitability_potential);
  list('Financial Risks', report.financial_plan.financial_risks);

  heading('5. Investment Report');
  field('Investor Recommendation', report.investment_report.investor_recommendation);
  list('SWOT - Strengths', report.investment_report.swot.strengths);
  list('SWOT - Weaknesses', report.investment_report.swot.weaknesses);
  list('SWOT - Opportunities', report.investment_report.swot.opportunities);
  list('SWOT - Threats', report.investment_report.swot.threats);
  list('Pitch Deck Outline', report.investment_report.pitch_deck_outline);

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`AI Startup Validator | Page ${page} of ${pages}`, margin, pageHeight - 8);
  }

  const slug = report.idea
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'startup';
  const filename = `${slug}-validation-report.pdf`;
  pdf.save(filename);
  return filename;
}
