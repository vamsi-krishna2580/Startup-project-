/**
 * TypeScript Data Models for AI Startup Validator
 * Exactly mirrors the multi-agent backend output specification.
 */

export interface StartupAnalysis {
  summary: string;
  problem: string;
  solution: string;
  innovation: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  suggestions: string[];
  opportunity_score: number;
  verdict: string;
}

export interface CompetitorDetail {
  name: string;
  focus: string;
  advantage: string;
  disadvantage: string;
}

export interface MarketResearch {
  target_customers: string[];
  customer_segments: string[];
  market_size: string;
  market_demand: string;
  industry_trends: string[];
  competitors: string[] | CompetitorDetail[];
  customer_pain_points: string[];
  market_opportunities: string[];
  market_challenges: string[];
}

export interface BusinessStrategy {
  business_model: string;
  revenue_model: string;
  pricing_strategy: string;
  unique_value_proposition: string;
  go_to_market_strategy: string;
  customer_acquisition: string[];
  sales_channels: string[];
  partnerships: string[];
  growth_strategy: string;
  // Optional derived Business Model Canvas blocks
  key_partners?: string[];
  key_activities?: string[];
  key_resources?: string[];
  customer_relationships?: string[];
  cost_structure?: string[];
}

export interface FinancialYearProjection {
  year: string;
  revenue: number;
  costs: number;
  gross_profit: number;
}

export interface FinancialPlan {
  startup_cost_estimate: string;
  operating_costs: string;
  revenue_projection: string;
  break_even_estimate: string;
  funding_required: string;
  funding_utilization: string;
  financial_risks: string[];
  profitability_potential: string;
  // Optional numerical timeline projection for plotting
  timeline_projections?: FinancialYearProjection[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface InvestmentReport {
  executive_summary: string;
  elevator_pitch: string;
  swot: SWOTAnalysis;
  investment_readiness_score: number;
  recommended_funding_stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Not investment ready' | string;
  investor_recommendation: string;
  pitch_deck_outline: string[];
  final_verdict: string;
}

export interface StartupReport {
  id?: string;
  idea: string;
  created_at?: string;
  startup_analysis: StartupAnalysis;
  market_research: MarketResearch;
  business_strategy: BusinessStrategy;
  financial_plan: FinancialPlan;
  investment_report: InvestmentReport;
  source?: 'api' | 'demo';
  optional_inputs?: {
    industry?: string;
    target_customer?: string;
    region?: string;
    stage?: string;
    budget?: string;
  };
}

export interface AnalyzeStartupRequest {
  idea: string;
  industry?: string;
  target_customer?: string;
  region?: string;
  stage?: string;
  budget?: string;
}

export type AgentStageId = 1 | 2 | 3 | 4 | 5;

export type AgentStatus = 'waiting' | 'running' | 'completed' | 'failed';

export interface AgentStageInfo {
  id: AgentStageId;
  number: string;
  name: string;
  role: string;
  purpose: string;
  outputDescription: string;
  status: AgentStatus;
  startedAt?: number;
  completedAt?: number;
  errorMessage?: string;
  logMessage?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  idea: string;
  opportunity_score: number;
  investment_readiness_score: number;
  verdict: string;
  funding_stage: string;
  date: string;
  createdAt?: string;
  status?: string;
  report: StartupReport;
}

export type HistoryItem = AnalysisHistoryItem;

