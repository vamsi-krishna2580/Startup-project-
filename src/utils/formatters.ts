import { AgentStageInfo } from '../types/startup';

export const INITIAL_AGENT_STAGES: AgentStageInfo[] = [
  {
    id: 1,
    number: '01',
    name: 'Startup Analyst',
    role: 'Concept & Problem-Solution Fit',
    purpose: 'Validates the core startup concept, evaluates problem-solution alignment, and calculates early opportunity viability.',
    outputDescription: 'Executive concept teardown, innovation rating, core strengths, weaknesses, risks & opportunity score.',
    status: 'waiting'
  },
  {
    id: 2,
    number: '02',
    name: 'Market Research',
    role: 'Market Sizing & Competition',
    purpose: 'Assesses total addressable market (TAM/SAM/SOM), evaluates customer segments, and constructs competitor matrices.',
    outputDescription: 'Target customer archetypes, market demand trajectory, industry trends, and competitor defensibility table.',
    status: 'waiting'
  },
  {
    id: 3,
    number: '03',
    name: 'Business Strategy',
    role: 'Business Model & GTM',
    purpose: 'Formulates sustainable revenue models, value propositions, customer acquisition channels, and the Business Model Canvas.',
    outputDescription: '9-block Business Model Canvas, pricing tier structure, sales channels, and land-and-expand growth plan.',
    status: 'waiting'
  },
  {
    id: 4,
    number: '04',
    name: 'Financial Planning',
    role: 'Unit Economics & Runway',
    purpose: 'Models estimated startup costs, operating expenses, funding requirements, burn rate, and break-even timelines.',
    outputDescription: 'Startup capital estimate, 3-year revenue projections, monthly burn rate, break-even month, and financial risks.',
    status: 'waiting'
  },
  {
    id: 5,
    number: '05',
    name: 'Investment Advisor',
    role: 'Venture Capital & Readiness',
    purpose: 'Performs comprehensive SWOT synthesis, pitch deck blueprinting, and calculates venture investment readiness.',
    outputDescription: '4-quadrant SWOT matrix, elevator pitch, 12-slide pitch deck outline, and institutional investor verdict.',
    status: 'waiting'
  }
];

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
  badge: string;
} {
  if (score >= 80) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'stroke-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  }
  if (score >= 65) {
    return {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      ring: 'stroke-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      ring: 'stroke-amber-600',
      badge: 'bg-amber-100 text-amber-800 border-amber-200'
    };
  }
  return {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'stroke-rose-600',
    badge: 'bg-rose-100 text-rose-800 border-rose-200'
  };
}

export function getScoreBadgeClass(score: number): string {
  return getScoreColor(score).badge;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function downloadJsonFile(data: unknown, filename = 'startup-validation-report.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
