import React from 'react';
import { BusinessStrategy } from '../types/startup';
import { 
  Users, 
  Layers, 
  Cpu, 
  Sparkles, 
  HeartHandshake, 
  Truck, 
  Target, 
  DollarSign, 
  CreditCard,
  Check
} from 'lucide-react';

interface BusinessModelCanvasProps {
  strategy: BusinessStrategy;
}

export const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({ strategy }) => {
  // Derivations with graceful fallback to standard business_strategy fields
  const keyPartners = strategy.key_partners && strategy.key_partners.length > 0
    ? strategy.key_partners
    : strategy.partnerships;

  const keyActivities = strategy.key_activities && strategy.key_activities.length > 0
    ? strategy.key_activities
    : [
        'Core product algorithmic engineering and pipeline scaling',
        'Customer onboarding and ongoing success management',
        'Sales channel enablement and strategic partnership maintenance'
      ];

  const keyResources = strategy.key_resources && strategy.key_resources.length > 0
    ? strategy.key_resources
    : [
        'Proprietary validation models and specialized dataset assets',
        'Cloud processing and microservices architecture',
        'Experienced engineering and go-to-market leadership'
      ];

  const valueProps = [
    strategy.unique_value_proposition,
    `Optimized for ${strategy.pricing_strategy.split(':')[0] || 'rapid payback'}`,
    strategy.business_model
  ];

  const customerRelationships = strategy.customer_relationships && strategy.customer_relationships.length > 0
    ? strategy.customer_relationships
    : [
        'Dedicated onboarding for commercial and enterprise tiers',
        'Self-guided interactive dashboards and documentation',
        'Continuous performance feedback loops and automated health checks'
      ];

  const channels = strategy.sales_channels;

  const customerSegments = strategy.customer_acquisition.slice(0, 3);

  const costStructure = strategy.cost_structure && strategy.cost_structure.length > 0
    ? strategy.cost_structure
    : [
        'Cloud infrastructure compute and storage bandwidth',
        'Core development and domain expert payroll',
        'Sales and marketing customer acquisition expenditures'
      ];

  const revenueStreams = [
    strategy.revenue_model,
    `Pricing Model: ${strategy.pricing_strategy}`
  ];

  return (
    <div id="business-model-canvas-container" className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">CANVAS ARCHITECTURE</span>
          <h3 className="text-base font-bold text-slate-900">9-Block Business Model Canvas</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>Synthesized from Business Strategy Agent</span>
        </div>
      </div>

      {/* 9-Block Grid: Top 5 columns (Activities/Resources nested under 2nd column) */}
      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200 text-xs">
        {/* Block 1: Key Partners */}
        <div className="p-4 flex flex-col justify-between bg-white hover:bg-slate-50/50 transition-colors min-h-[190px]">
          <div>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Key Partners</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {keyPartners.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 2: Key Activities & Key Resources stacked */}
        <div className="divide-y divide-slate-200 bg-white min-h-[190px]">
          <div className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Activities</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {keyActivities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Resources</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {keyResources.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 3: Value Propositions */}
        <div className="p-4 flex flex-col justify-between bg-blue-50/20 hover:bg-blue-50/40 transition-colors min-h-[190px]">
          <div>
            <div className="flex items-center gap-1.5 text-blue-900 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Value Proposition</span>
            </div>
            <ul className="space-y-2 text-slate-800">
              {valueProps.map((item, idx) => (
                <li key={idx} className="p-2 rounded-lg bg-white border border-blue-100 shadow-2xs leading-relaxed text-[11px]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 4: Customer Relationships & Channels stacked */}
        <div className="divide-y divide-slate-200 bg-white min-h-[190px]">
          <div className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Relationships</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {customerRelationships.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Channels</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {channels.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 5: Customer Segments */}
        <div className="p-4 flex flex-col justify-between bg-white hover:bg-slate-50/50 transition-colors min-h-[190px]">
          <div>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-2">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Customer Segments</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              {customerSegments.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row: Cost Structure (Left) & Revenue Streams (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
        {/* Cost Structure */}
        <div className="p-4 bg-slate-50/40">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold uppercase tracking-wider text-[11px] mb-2">
            <CreditCard className="w-3.5 h-3.5 text-rose-600" />
            <span>Cost Structure</span>
          </div>
          <ul className="space-y-1.5 text-slate-600">
            {costStructure.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Revenue Streams */}
        <div className="p-4 bg-emerald-50/30">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[11px] mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Revenue Streams</span>
          </div>
          <ul className="space-y-1.5 text-slate-800">
            {revenueStreams.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span className="leading-snug font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
