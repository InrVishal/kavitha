import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CloudRain, ShieldAlert, Users, Navigation, 
  ChevronRight, Play, Loader2, AlertCircle,
  Activity, Radio, Target, Zap, Waves, Satellite
} from 'lucide-react';

export default function ScenarioHub() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scenarioData, setScenarioData] = useState<any>(null);

  useEffect(() => {
    api.get('/scenarios/flood-scenario')
      .then(r => {
        setScenarioData(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center bg-bg-primary">
        <div className="relative w-16 h-16 mb-6">
           <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Simulation...</span>
    </div>
  );

  return (
    <div className="p-8 lg:p-16 max-w-7xl mx-auto font-sans min-h-screen bg-bg-primary">
      <div className="mb-16 animate-fade-slide-up">
        <div className="flex items-center gap-6 mb-8">
           <div className="px-4 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-widest uppercase">
              How it works
           </div>
           <div className="h-px flex-1 bg-slate-100" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-6">
           Our Response <span className="text-indigo-600">Process</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
           A step-by-step breakdown of the <span className="text-slate-900 font-bold">{scenarioData.title}</span>. Learn how our platform converts real-time data into actionable, life-saving decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-8">
          {scenarioData.steps.map((step: any, i: number) => (
            <div 
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`group bg-white border transition-all cursor-pointer relative overflow-hidden rounded-[40px] p-10 ${
                activeStep === i ? 'border-indigo-200 shadow-2xl shadow-indigo-500/5 ring-4 ring-indigo-500/5 scale-[1.01]' : 'border-slate-100 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
              }`}
            >
              <div className="flex items-start gap-8">
                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-300 ${
                  activeStep === i ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                   <span className="text-xl font-bold">{step.id}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold tracking-tight transition-colors ${
                       activeStep === i ? 'text-slate-900' : 'text-slate-400'
                    }`}>{step.title}</h3>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{step.timestamp}</span>
                  </div>
                  <p className={`text-[15px] leading-relaxed font-medium transition-colors ${
                     activeStep === i ? 'text-slate-500' : 'text-slate-300'
                  }`}>
                    {step.description}
                  </p>

                  {activeStep === i && (
                    <div className="mt-8 pt-8 border-t border-slate-50 animate-fade-in">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="flex flex-col gap-1">
                             <span className="text-[9px] uppercase font-bold text-slate-300 tracking-widest">System Signal</span>
                             <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">Active Monitoring</span>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[9px] uppercase font-bold text-slate-300 tracking-widest">Status</span>
                             <span className={`text-xs font-bold uppercase tracking-widest ${
                                step.status === 'Critical' ? 'text-rose-600' : 'text-emerald-600'
                             }`}>{step.status}</span>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {/* Analysis Side Card */}
          <div className="bg-white border border-slate-200 rounded-[48px] p-10 lg:p-12 sticky top-32 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                <Satellite className="w-40 h-40 text-indigo-600" />
             </div>
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 relative z-10">Data Analysis</h4>
             
             <div className="space-y-10 relative z-10">
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Risk Mapping</span>
                   </div>
                   <div className="h-40 w-full rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden flex items-center justify-center">
                      <Waves className="w-20 h-20 text-indigo-500 opacity-5 animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">{scenarioData.outputs.riskHeatmap}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Priority Focus</span>
                   </div>
                   <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
                      <p className="text-sm font-bold text-amber-700 tracking-tight">{scenarioData.outputs.rescuePriority}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Navigation className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Safe Exit Route</span>
                   </div>
                   <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                      <p className="text-sm font-bold text-emerald-700 uppercase tracking-tight">{scenarioData.outputs.primaryEvac}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-8 group">
             <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:rotate-12 transition-transform">
                   <ShieldAlert className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">How it works</h4>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Our system uses a <span className="text-slate-900 font-bold">Priority-Weighting Algorithm</span> that adjusts instantly as sensors detect changes in water or structural health.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
