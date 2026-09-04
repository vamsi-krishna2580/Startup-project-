import { StartupReport } from '../types/startup';

/**
 * Benchmark reference dataset for college capstone demonstration:
 * "AI-powered crop disease detection using drones"
 *
 * This file is strictly isolated from production API network calls.
 */
export const DEMO_CROP_DRONE_REPORT: StartupReport = {
  id: 'demo-drone-crop-001',
  idea: 'AI-powered crop disease detection using drones that provides small and mid-sized farmers with automated multispectral leaf analysis and early blight warnings.',
  created_at: new Date().toISOString(),
  source: 'demo',
  optional_inputs: {
    industry: 'AgTech / Precision Agriculture',
    target_customer: 'Commercial grain & specialty crop farmers (500–5,000 acres)',
    region: 'North America & Western Europe',
    stage: 'Prototype / Idea Validation',
    budget: '$150,000 Initial Bootstrapping'
  },
  startup_analysis: {
    summary: 'An autonomous precision agriculture platform integrating commercial off-the-shelf multispectral drones with edge-accelerated computer vision models to detect fungal and bacterial pathogens up to 14 days before visible leaf necrosis occurs.',
    problem: 'Crop diseases cause over $220 billion in annual global yield losses. Traditional scouting relies on manual field walks, which are slow, labor-intensive, and typically only catch infections after severe irreversible foliage damage has already occurred.',
    solution: 'Automated autonomous drone flight paths combined with cloud-based computer vision (trained on over 2.4M validated crop pathology images) deliver sub-centimeter heatmaps and automated fungicide prescription maps within 90 minutes of flight.',
    innovation: 'Proprietary spectral index ratio algorithms combining Normalized Difference Red Edge (NDRE) with thermal micro-stress gradients, detecting plant vascular collapse before visible discoloration.',
    strengths: [
      'Reduces chemical fungicide usage by 32% via variable-rate spot spraying rather than blanket field application.',
      'Saves an estimated 40+ hours per week of manual agronomist scouting labor during critical growth windows.',
      'Hardware-agnostic drone ingestion protocol (compatible with DJI Enterprise, Parrot, and Wingtra imagery).',
      'Integration ready with John Deere Operations Center and Climate FieldView via REST endpoints.'
    ],
    weaknesses: [
      'Dependent on FAA Part 107 / EASA BVLOS (Beyond Visual Line of Sight) drone flight regulations and regional permits.',
      'Inclement weather (high wind >25 knots, heavy rain) restricts flight windows during peak outbreak seasons.',
      'High initial upfront hardware acquisition cost for multispectral sensors ($3,500 - $7,000 per drone unit).'
    ],
    risks: [
      'Sensor calibration drift leading to false-positive fungicide application alerts.',
      'Incumbent farm management software suites developing native computer vision plug-ins.',
      'Slow rural broadband speeds delaying high-resolution raw orthomosaic image uploads.'
    ],
    suggestions: [
      'Implement on-device edge compression and pre-filtering on the pilot controller to reduce cellular data bandwidth.',
      'Offer a Hardware-as-a-Service (HaaS) lease model bundled with certified third-party drone pilot dispatch.',
      'Validate detection accuracy with university agricultural extension stations to publish peer-reviewed agronomic efficacy papers.'
    ],
    opportunity_score: 82,
    verdict: 'High Viability — Validated Market Need with Strong Unit Economics'
  },
  market_research: {
    target_customers: [
      'Mid-market row crop growers (Corn, Soy, Wheat, Potatoes) managing 1,000–5,000 acres',
      'High-value specialty crop producers (Vineyards, Berry orchards, Citrus groves)',
      'Independent agricultural crop consultants, cooperatives, and retail agronomists'
    ],
    customer_segments: [
      'Commercial Independent Farms (58% of target addressable market)',
      'Agronomic Consulting Firms & Co-ops (26% of target addressable market)',
      'Corporate Agribusiness & Agro-chemical Trial R&D (16% of target addressable market)'
    ],
    market_size: 'Total Addressable Market (TAM) $12.8B (Precision Ag Drones & Analytics); Serviceable Addressable Market (SAM) $2.4B; Serviceable Obtainable Market (SOM) $180M (Years 1–3 in US Midwest & California).',
    market_demand: 'High & Accelerating: Driven by severe farm labor shortages (up 28% wage pressure), stricter EU/EPA pesticide runoff limits, and rising input fertilizer/fungicide costs.',
    industry_trends: [
      'Shift towards biological and targeted micro-dosage spray treatments to comply with ESG mandates.',
      'Rapid adoption of autonomous drone-in-a-box docking stations for scheduled unattended scouting.',
      'Consolidation of agricultural data platforms into unified telemetry dashboards.'
    ],
    competitors: [
      {
        name: 'Taranis',
        focus: 'Sub-millimeter leaf level insect and weed scouting using aircraft and drones',
        advantage: 'Heavy venture backing ($100M+) and large enterprise footprint',
        disadvantage: 'High cost barrier; turnaround time often exceeds 48 hours; opaque pricing'
      },
      {
        name: 'Sentera',
        focus: 'Integrated sensors and agronomic analytics software for field equipment',
        advantage: 'Strong direct OEM relationships with John Deere equipment dealers',
        disadvantage: 'Focus is broad across general yield estimation rather than specialized pathology'
      },
      {
        name: 'DroneDeploy Ag',
        focus: 'General aerial mapping, volumetric measurement, and field boundaries',
        advantage: 'Universal drone software adoption with massive user base',
        disadvantage: 'Lacks deep domain agronomic disease diagnosis algorithms; generic NDVI only'
      },
      {
        name: 'Manual Agronomy Scouting',
        focus: 'Traditional boots-on-the-ground visual crop inspection',
        advantage: 'Zero capital expenditure; deep personal relationship with farmer',
        disadvantage: 'Covers <3% of field area sample; physically incapable of early detection'
      }
    ],
    customer_pain_points: [
      'Discovering fungal blight after 20% of the field is already infected, forcing emergency blanket spraying.',
      'Inability to hire qualified seasonal agronomists or scouts during high humidity outbreaks.',
      'Wasted chemical expenditures spraying healthy acreage due to lack of geo-referenced spatial coordinates.'
    ],
    market_opportunities: [
      'Carbon credit verification and sustainable farming rebate certifications for documented chemical reduction.',
      'White-label SaaS offering for agricultural chemical distributors seeking digital retention tools.',
      'Expanding into autonomous drone spray dispatch: detect with scout drone, treat immediately with heavy payload spray drone.'
    ],
    market_challenges: [
      'Educating multi-generational farmers who are skeptical of black-box AI algorithms without agronomic proof.',
      'Seasonal revenue cycles: cash inflows concentrate in Q2/Q3 with winter dormancy in temperate northern climates.'
    ]
  },
  business_strategy: {
    business_model: 'Hybrid B2B SaaS + Per-Acre Scouting Hardware Bundle (Tiered Subscription with Annual Contracts)',
    revenue_model: 'Annual recurring software license ($4.50 / acre / year) + Turnkey drone inspection kit leasing ($399 / month) + Enterprise API data feeds for chemical manufacturers ($25k / year).',
    pricing_strategy: 'Tiered Value-Based Pricing based on acre capacity: Tier 1: Small Grower (<1,000 acres) at $3,900/yr; Tier 2: Commercial Scale (1,000-5,000 acres) at $9,500/yr; Tier 3: Enterprise Agronomist Unlimited at $24,000/yr.',
    unique_value_proposition: 'Guaranteed 90-minute turnaround from drone landing to VRA fungicide spray prescription file directly imported to tractor GPS, saving $38/acre in prevented yield loss and chemical inputs.',
    go_to_market_strategy: 'Channel-partner first: Target independent agricultural retailers and seed/fertilizer dealerships as reseller affiliates with 15% commissions, bypassing direct farm cold outreach.',
    customer_acquisition: [
      'Partnering with regional agronomy co-ops for joint grower field day demonstrations.',
      'Free 100-acre pilot scan comparison against traditional agronomist ground scouting.',
      'Technical agronomy podcast sponsorships and regional Ag-Expo showcase booths.'
    ],
    sales_channels: [
      'Ag-Retailer Co-op Reseller Network (Primary - 60%)',
      'Direct Enterprise Agronomy Sales Team (30%)',
      'Self-serve Drone Pilot Service Network Referral (10%)'
    ],
    partnerships: [
      'John Deere Operations Center API integration for seamless tractor console file transfer.',
      'Purdue & Iowa State University Agricultural Extension for academic model validation.',
      'Drone manufacturers (DJI Enterprise, Autel Robotics) for preferred hardware bundle discounts.'
    ],
    growth_strategy: 'Land-and-expand across grower portfolios: start with high-risk test acreage (200 acres), expand across full acreage portfolio in Year 2, then upsell autonomous drone dock installations for daily automated patrols.',
    key_partners: [
      'Agricultural retailers and input supply cooperatives',
      'Drone hardware OEMs and authorized regional maintenance centers',
      'University Plant Pathology extension labs and agronomy research programs'
    ],
    key_activities: [
      'Continuous computer vision training on multispectral pathogen datasets',
      'Automated orthomosaic photogrammetry and cloud stitching pipeline optimization',
      'Agronomic field support and tractor terminal integration maintenance'
    ],
    key_resources: [
      'Proprietary dataset of 2.4M ground-truth verified plant disease spectral signatures',
      'Automated cloud photogrammetry processing pipeline (GPU accelerated)',
      'Deep domain agronomy and GIS engineering team'
    ],
    customer_relationships: [
      'Dedicated Customer Agronomist assigned to each commercial grower account',
      'Seasonal pre-planting calibration calls and real-time in-season disease alert notifications',
      'End-of-season ROI verification audit calculating exact chemicals saved'
    ],
    cost_structure: [
      'GPU Cloud processing & photogrammetry pipeline compute (AWS EC2 G5 instances)',
      'Customer success agronomist salaries and field travel support',
      'R&D dataset collection, academic field trials, and model refinement',
      'Channel partner commission payouts and marketing field days'
    ]
  },
  financial_plan: {
    startup_cost_estimate: '$175,000 (Cloud architecture development: $65k; Sensor calibration testbed: $35k; Pilot grower hardware kits: $40k; Legal/IP & Agronomic trial fees: $35k)',
    operating_costs: '$28,000 / month (AWS GPU compute cluster: $8k; Core engineering & agronomist: $15k; Sales & pilot travel: $3k; Insurance & administration: $2k)',
    revenue_projection: 'Year 1: $140,000 ARR (18 commercial growers; 32,000 acres); Year 2: $680,000 ARR (75 growers + 4 ag co-ops); Year 3: $2,450,000 ARR (280 accounts across 5 states).',
    break_even_estimate: 'Month 19 post-launch (at approximately 85,000 contracted active acres or $42,000 Monthly Recurring Revenue).',
    funding_required: '$750,000 Seed Round (18 months of runway to reach $700k ARR and secure 100k contracted acres).',
    funding_utilization: '40% Engineering & ML Pipeline, 30% Channel Sales & Grower Onboarding, 18% Academic Trials & Ground-Truth Dataset Expansion, 12% Working Capital & Hardware Buffer.',
    financial_risks: [
      'High seasonal cash flow volatility: annual contracts billed in spring with collection exposure during bad harvest years.',
      'Potential GPU compute cost overruns if raw drone imagery upload size exceeds projected photogrammetry quotas.',
      'Customer churn if unseasonably dry weather results in low pathogen prevalence during year one of subscription.'
    ],
    profitability_potential: 'Very Strong: 78% software gross margin once GPU batch processing pipeline scales above 50,000 acres, yielding long-term EBITDA potential of 28–34% by Year 4.',
    timeline_projections: [
      { year: 'Year 1 (Pilot)', revenue: 140000, costs: 336000, gross_profit: -196000 },
      { year: 'Year 2 (Expansion)', revenue: 680000, costs: 520000, gross_profit: 160000 },
      { year: 'Year 3 (Scale)', revenue: 2450000, costs: 1180000, gross_profit: 1270000 },
      { year: 'Year 4 (Mature)', revenue: 5800000, costs: 2400000, gross_profit: 3400000 }
    ]
  },
  investment_report: {
    executive_summary: 'An outstanding AgTech investment opportunity capitalizing on farm labor shortages and precision agricultural mandates. By transforming off-the-shelf multispectral drone flights into rapid 90-minute prescriptive fungicide maps, the company directly tackles a $220B disease loss problem with an immediate, provable ROI for mid-sized farmers.',
    elevator_pitch: 'We turn 20-minute autonomous drone flights into immediate crop-saving fungicide prescriptions, protecting $40/acre in farmer yield while slashing toxic chemical runoff by over 30%.',
    swot: {
      strengths: [
        'Proprietary early-stage spectral ratio detection (14 days before visible damage).',
        'Hardware agnostic: leverages existing farmer drone equipment.',
        'Seamless integration with John Deere & Climate FieldView tractor consoles.',
        'Compelling ROI: payback achieved within a single crop season.'
      ],
      weaknesses: [
        'Seasonal revenue concentration requires disciplined cash reserve management.',
        'Flight operations bound by regional drone weather and airspace guidelines.',
        'Requires grower education on trusting algorithmic pathogen heatmaps.'
      ],
      opportunities: [
        'Expansion into automated autonomous drone docks for zero-touch daily flight missions.',
        'Carbon credit and sustainable ESG certification validation marketplace.',
        'High-margin data licensing to crop chemical and seed genetics conglomerates.'
      ],
      threats: [
        'Equipment incumbents (John Deere, CNH) integrating optical weed/disease sensors directly on sprayer booms.',
        'Aggressive venture-subsidized pricing from established AgTech monitoring firms.',
        'Global supply chain shortages on high-performance multispectral drone sensors.'
      ]
    },
    investment_readiness_score: 79,
    recommended_funding_stage: 'Seed',
    investor_recommendation: 'Recommended for Seed Investment — The venture exhibits strong unit economics, defensible data moats via ground-truth pathology datasets, and an aligned distribution channel through regional ag-retailers.',
    pitch_deck_outline: [
      '1. Title & Mission: Autonomous Early-Stage Crop Pathology',
      '2. The Crisis: The $220 Billion Crop Disease Problem and Agronomist Labor Shortage',
      '3. The Solution: Turnkey Multispectral Drone Ingestion & 90-minute Prescriptions',
      '4. Technology & IP: Pre-visual Spectral Indices & Cloud Photogrammetry Pipeline',
      '5. Market Opportunity: $12.8B Precision Ag Analytics Market with Focus on Midwest Row Crops',
      '6. Business Model & Unit Economics: $4.50/acre Recurring SaaS with 78% Gross Margins',
      '7. Traction & Field Trial Validation: 3 University Trials and 32,000 Pilot Acres',
      '8. Competitive Matrix: Why Hardware-Agnostic Pathology Beats General NDVI Mapping',
      '9. Go-To-Market: The Co-op & Ag-Retailer Reseller Flywheel',
      '10. Financial Projections & Break-even Timeline: Month 19 to Cashflow Neutral',
      '11. The Team: Agronomy PhDs, Computer Vision Veterans, and Enterprise Ag Sales',
      '12. The Ask: $750k Seed Round for 18-Month Runway to $700k ARR'
    ],
    final_verdict: 'High Potential — Viable Seed Candidate with High Barrier-to-Entry Data Moat'
  }
};

/**
 * Procedural mock generator for custom ideas during offline/demo mode,
 * ensuring students or judges testing any custom idea receive a rich,
 * multi-agent structured report even if their local FastAPI backend is offline.
 */
export function generateSyntheticReport(ideaText: string, optionalInputs?: Record<string, string>): StartupReport {
  const cleanIdea = ideaText.trim();
  const titleWords = cleanIdea.split(' ').slice(0, 5).join(' ');
  const industry = optionalInputs?.industry || 'Enterprise SaaS / AI Platform';
  const targetCust = optionalInputs?.target_customer || 'Mid-market businesses and specialized practitioners';
  const region = optionalInputs?.region || 'Global / North America';

  // Deterministic opportunity score based on length and content
  const hash = cleanIdea.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const opportunityScore = 70 + (hash % 20); // 70 to 89
  const investmentScore = 65 + ((hash * 7) % 25); // 65 to 89

  const verdictTier = opportunityScore > 80
    ? 'Promising — Strong Market Opportunity with High Differentiation'
    : 'Viable — Requires Focused Go-To-Market and Customer Discovery';

  const fundingStage = investmentScore > 78 ? 'Seed' : investmentScore > 68 ? 'Pre-seed' : 'Series A';

  return {
    id: `synthetic-${Date.now()}`,
    idea: cleanIdea,
    created_at: new Date().toISOString(),
    source: 'demo',
    optional_inputs: {
      industry,
      target_customer: targetCust,
      region,
      stage: optionalInputs?.stage || 'Idea / Pre-seed',
      budget: optionalInputs?.budget || 'Bootstrapped / Initial Angel'
    },
    startup_analysis: {
      summary: `A specialized validation analysis for "${titleWords}..." focusing on delivering quantifiable workflow automation, cost reduction, and scalable modern architecture.`,
      problem: `Target customers currently struggle with fragmented, manual procedures, high operational latency, and lack of intelligent decision-support systems in the ${industry} domain.`,
      solution: `An integrated, domain-specific AI platform that unifies disparate data streams into automated, actionable recommendations, eliminating repetitive labor and cutting overhead.`,
      innovation: `Context-aware specialized intelligence layer combined with modular API connectors, providing immediate time-to-value without heavy enterprise onboarding friction.`,
      strengths: [
        `Directly addresses documented friction points in ${industry}.`,
        'High gross margin profile characteristic of modern software-enabled workflows.',
        'Modular architectural boundaries allow rapid iteration and API extensibility.',
        'Scalable self-serve onboarding capability reducing customer acquisition cycle.'
      ],
      weaknesses: [
        'Initial model accuracy depends on quality and diversity of training inputs.',
        'Switching costs from entrenched legacy tools require strong incentives and migration tooling.',
        'Early brand awareness will require focused community and outbound marketing.'
      ],
      risks: [
        'Incumbent enterprise software suites adding adjacent lightweight features.',
        'Regulatory or compliance friction depending on jurisdiction and data sensitivity.',
        'Long sales cycles if expanding into traditional slow-moving enterprises.'
      ],
      suggestions: [
        'Launch with a tight vertical niche before expanding horizontally into adjacent markets.',
        'Establish 5–10 reference customer case studies with verified ROI metrics.',
        'Build self-service sandbox environments to demonstrate time-to-value within 5 minutes.'
      ],
      opportunity_score: opportunityScore,
      verdict: verdictTier
    },
    market_research: {
      target_customers: [
        targetCust,
        'Enterprise operations managers seeking efficiency benchmarks',
        'Independent service providers and technical consultancies'
      ],
      customer_segments: [
        'Primary: Mid-Market Organizations (50–500 employees)',
        'Secondary: Departmental Enterprise Teams',
        'Tertiary: High-Growth Technology Startups'
      ],
      market_size: `Estimated TAM $8.5B in targeted ${industry} technology spend; SAM of $1.8B; SOM of $120M in initial serviceable launch segments. (AI-estimated baseline).`,
      market_demand: 'Moderate to High: Accelerated demand driven by operational cost optimization and competitive pressure to integrate intelligent automation.',
      industry_trends: [
        'Rapid migration towards API-first, composable microservices architectures.',
        'Democratization of specialized analytical tools directly into frontline team hands.',
        'Increased scrutiny on demonstrable payback periods (<6 months).'
      ],
      competitors: [
        {
          name: 'Established Incumbent Suites',
          focus: 'Broad enterprise resource management and legacy workflows',
          advantage: 'High enterprise install base and long-term procurement relationships',
          disadvantage: 'Clunky legacy UI, slow release cadence, high annual licensing minimums'
        },
        {
          name: 'Point-Solution Startups',
          focus: 'Narrow single-feature automated utilities',
          advantage: 'Rapid tactical execution and low entry price points',
          disadvantage: 'Lack end-to-end workflow context; high risk of feature commoditization'
        },
        {
          name: 'Internal In-House Tooling',
          focus: 'Custom internal scripts, spreadsheets, and open-source mashups',
          advantage: 'Low apparent cash cost and exact customization to existing quirks',
          disadvantage: 'High ongoing engineering maintenance tax, technical debt, no support'
        }
      ],
      customer_pain_points: [
        'Excessive hours spent in manual coordination, data extraction, and verification.',
        'Lack of real-time visibility into bottlenecks, errors, and performance metrics.',
        'Disjointed tech stacks creating information silos between functional teams.'
      ],
      market_opportunities: [
        'High-retention land-and-expand sales motion across cross-functional departments.',
        'Potential for ecosystem marketplace integrations with standard CRM and ERP platforms.',
        'Industry benchmark data aggregation creating a defensible proprietary network effect.'
      ],
      market_challenges: [
        'Educating prospective buyers on moving beyond traditional spreadsheet workflows.',
        'Ensuring enterprise-grade security and SOC2 compliance early in company lifecycle.'
      ]
    },
    business_strategy: {
      business_model: 'B2B SaaS Subscription (Tiered per-seat or usage-based pricing with annual contract options)',
      revenue_model: 'Recurring Monthly/Annual Subscription Tiers + Professional Pilot Implementation Services + Enterprise Custom SLA add-ons.',
      pricing_strategy: 'Value-based tiered model: Starter ($49/mo), Professional ($199/mo), and Enterprise Custom ($1,200+/mo billed annually).',
      unique_value_proposition: 'Delivers 10x faster execution speed with 40% reduction in manual operational errors, backed by seamless modern integrations.',
      go_to_market_strategy: 'Product-Led Growth (PLG) entry point backed by targeted outbound account-based marketing toward high-intent vertical titles.',
      customer_acquisition: [
        'Content marketing and practical technical teardowns addressing core pain points.',
        'Self-service 14-day full feature trial with zero credit card required.',
        'Strategic co-marketing webinars with complementary technology vendors.'
      ],
      sales_channels: [
        'Inbound Product-Led Signups (45%)',
        'Direct Outbound Account-Based Sales (40%)',
        'Technology Partner App Ecosystems (15%)'
      ],
      partnerships: [
        'Integration partners with leading cloud storage and productivity platforms.',
        'Industry association endorsements and certification bodies.',
        'Select boutique consultancy implementation partners.'
      ],
      growth_strategy: 'Scale customer lifetime value by developing advanced analytical modules and workflow automations that expand organic adoption across adjacent departments.',
      key_partners: [
        'Cloud infrastructure providers and hosting partners',
        'Ecosystem marketplace and developer community channels',
        'Industry advisors and early design partner organizations'
      ],
      key_activities: [
        'Core algorithmic performance and low-latency API infrastructure',
        'High-touch user onboarding and customer feedback iteration cycles',
        'Continuous security hardening and regulatory compliance audits'
      ],
      key_resources: [
        'Specialized product engineering and UI/UX design team',
        'Proprietary evaluation benchmarks and operational telemetry datasets',
        'Lean customer success and technical documentation framework'
      ],
      customer_relationships: [
        'Self-guided interactive onboarding flows with comprehensive documentation',
        'In-app live chat and priority response SLAs for paid tier subscribers',
        'Quarterly strategic business reviews for enterprise-tier accounts'
      ],
      cost_structure: [
        'Cloud hosting, serverless compute, and database infrastructure',
        'Product development engineering and design payroll',
        'Inbound marketing, content syndication, and outbound acquisition tooling',
        'Administrative, legal, accounting, and compliance insurance'
      ]
    },
    financial_plan: {
      startup_cost_estimate: '$120,000 (MVP Engineering: $55k; Design & UX: $20k; Initial Marketing & Pilots: $25k; Legal & Setup: $20k)',
      operating_costs: '$22,000 / month (Cloud hosting & tooling: $4k; Core team payroll: $14k; Marketing & acquisition: $3k; Admin: $1k)',
      revenue_projection: 'Year 1: $110,000 ARR; Year 2: $480,000 ARR; Year 3: $1,650,000 ARR with expansion across mid-market enterprise accounts.',
      break_even_estimate: 'Month 16 to 18 post-launch (assuming 45 paying business accounts reached with typical 85% annual retention).',
      funding_required: '$500,000 to $750,000 (Targeting 15 to 18 months of runway to reach product-market fit and $50k MRR).',
      funding_utilization: '45% Engineering & Product Velocity, 30% Go-To-Market & Pilot Acquisition, 15% Customer Success, 10% Reserve Buffer.',
      financial_risks: [
        'Lengthening enterprise procurement cycles during macroeconomic caution.',
        'Initial customer acquisition costs (CAC) exceeding early lifetime value (LTV).',
        'High cloud compute costs before architectural caching and query optimization.'
      ],
      profitability_potential: 'High: Target 80%+ software gross margins after initial infrastructure scaling, reaching operating cashflow positivity at $600k ARR.',
      timeline_projections: [
        { year: 'Year 1 (Initial Launch)', revenue: 110000, costs: 264000, gross_profit: -154000 },
        { year: 'Year 2 (Traction)', revenue: 480000, costs: 410000, gross_profit: 70000 },
        { year: 'Year 3 (Scaling)', revenue: 1650000, costs: 920000, gross_profit: 730000 },
        { year: 'Year 4 (Expansion)', revenue: 3900000, costs: 1800000, gross_profit: 2100000 }
      ]
    },
    investment_report: {
      executive_summary: `An agile software startup with strong fundamentals addressing critical workflow bottlenecks in ${industry}. The venture features attractive SaaS gross margins, a clean product-led entry vector, and clear milestones toward sustainable profitability.`,
      elevator_pitch: `We replace hours of manual, error-prone coordination in ${industry} with an intelligent automated system that cuts operational friction by 40% in days.`,
      swot: {
        strengths: [
          'High problem-solution alignment in an underserved functional workflow.',
          'Scalable digital delivery model with high structural gross margins.',
          'Clear path to rapid self-serve customer pilot validation.',
          'Agile modern tech stack allowing accelerated feature shipping.'
        ],
        weaknesses: [
          'Early-stage brand presence requiring proactive outbound trust-building.',
          'Limited historical data on customer churn across full multi-year cycles.',
          'Lean initial core team requiring key talent recruitment in sales.'
        ],
        opportunities: [
          'Expansion into vertical API integrations and ecosystem partner marketplaces.',
          'Upselling premium analytical tiers, advanced security, and enterprise audit logs.',
          'Geographic expansion into international regions with identical regulatory dynamics.'
        ],
        threats: [
          'Incumbent software platforms introducing native adjacent workflow modules.',
          'Budget freezes or delayed procurement approval chains in enterprise segments.',
          'Shifting privacy, compliance, or data sovereignty requirements.'
        ]
      },
      investment_readiness_score: investmentScore,
      recommended_funding_stage: fundingStage,
      investor_recommendation: `Recommended for ${fundingStage} Evaluation — Strong market tailwinds, balanced capital requirements, and achievable milestones toward cashflow neutral operations.`,
      pitch_deck_outline: [
        '1. Executive Summary & Vision Statement',
        '2. The Market Pain Point & Current Friction',
        '3. The Solution & Product Demo Teardown',
        '4. Market Size (TAM, SAM, SOM) & Target Segments',
        '5. Proprietary Technology & Architectural Moat',
        '6. Business Model, Pricing Tiers & Unit Economics',
        '7. Go-to-Market Strategy & Customer Acquisition Funnel',
        '8. Competitive Landscape & Defensibility Matrix',
        '9. Financial Model, Burn Rate & Break-even Timeline',
        '10. Core Team Background & Domain Expertise',
        '11. The Funding Ask, Milestones & Capital Allocation'
      ],
      final_verdict: `${verdictTier} (Investment Readiness: ${investmentScore}/100)`
    }
  };
}

export const MOCK_BENCHMARK_REPORT = DEMO_CROP_DRONE_REPORT;

