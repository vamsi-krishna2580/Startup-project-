from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field

class StartupAnalysis(BaseModel):
    summary: str = Field(..., description="Executive teardown of the concept and core value")
    problem: str = Field(..., description="Problem statement and friction points")
    solution: str = Field(..., description="Proposed solution and architecture")
    innovation: str = Field(..., description="Technical and market innovation tier")
    strengths: List[str] = Field(default_factory=list, description="Validated strong points")
    weaknesses: List[str] = Field(default_factory=list, description="Vulnerabilities and execution bottlenecks")
    risks: List[str] = Field(default_factory=list, description="Strategic and regulatory risks")
    suggestions: List[str] = Field(default_factory=list, description="Actionable analyst recommendations")
    opportunity_score: int = Field(..., ge=0, le=100, description="Numerical score 0-100")
    verdict: str = Field(..., description="Core assessment summary")

class CompetitorDetail(BaseModel):
    name: str
    focus: str
    advantage: str
    disadvantage: str

class MarketResearch(BaseModel):
    target_customers: List[str] = Field(default_factory=list)
    customer_segments: List[str] = Field(default_factory=list)
    market_size: str = Field(..., description="TAM / SAM / SOM addressable breakdown")
    market_demand: str = Field(..., description="Demand growth trajectory and CAGR")
    industry_trends: List[str] = Field(default_factory=list)
    competitors: Union[List[str], List[CompetitorDetail]] = Field(default_factory=list)
    customer_pain_points: List[str] = Field(default_factory=list)
    market_opportunities: List[str] = Field(default_factory=list)
    market_challenges: List[str] = Field(default_factory=list)

class BusinessStrategy(BaseModel):
    business_model: str
    revenue_model: str
    pricing_strategy: str
    unique_value_proposition: str
    go_to_market_strategy: str
    customer_acquisition: List[str] = Field(default_factory=list)
    sales_channels: List[str] = Field(default_factory=list)
    partnerships: List[str] = Field(default_factory=list)
    growth_strategy: str
    # Optional 9-block Canvas attributes
    key_partners: Optional[List[str]] = None
    key_activities: Optional[List[str]] = None
    key_resources: Optional[List[str]] = None
    customer_relationships: Optional[List[str]] = None
    cost_structure: Optional[List[str]] = None

class FinancialYearProjection(BaseModel):
    year: str
    revenue: float
    costs: float
    gross_profit: float

class FinancialPlan(BaseModel):
    startup_cost_estimate: str
    operating_costs: str
    revenue_projection: str
    break_even_estimate: str
    funding_required: str
    funding_utilization: str
    financial_risks: List[str] = Field(default_factory=list)
    profitability_potential: str
    timeline_projections: Optional[List[FinancialYearProjection]] = None

class SWOTAnalysis(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    opportunities: List[str] = Field(default_factory=list)
    threats: List[str] = Field(default_factory=list)

class InvestmentReport(BaseModel):
    executive_summary: str
    elevator_pitch: str
    swot: SWOTAnalysis
    investment_readiness_score: int = Field(..., ge=0, le=100)
    recommended_funding_stage: str = Field(..., description="Pre-seed | Seed | Series A | Not investment ready")
    investor_recommendation: str
    pitch_deck_outline: List[str] = Field(default_factory=list)
    final_verdict: str

class StartupReport(BaseModel):
    id: Optional[str] = None
    idea: str
    created_at: Optional[str] = None
    startup_analysis: StartupAnalysis
    market_research: MarketResearch
    business_strategy: BusinessStrategy
    financial_plan: FinancialPlan
    investment_report: InvestmentReport
    source: Optional[str] = "api"
    optional_inputs: Optional[Dict[str, Any]] = None

class AnalyzeStartupRequest(BaseModel):
    idea: str
    industry: Optional[str] = None
    target_customer: Optional[str] = None
    region: Optional[str] = None
    stage: Optional[str] = None
    budget: Optional[str] = None
