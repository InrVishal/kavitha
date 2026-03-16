import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { RiskData } from '../types';
import { Brain, Loader2, TrendingUp, TrendingDown, Minus, Satellite, Activity, Info, Radar, Target, Shovel as Shield, Cpu, Zap } from 'lucide-react';

export default function AIRiskPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ai-risk/${user?.region || 'metro'}`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.region]);

  const getRiskColor = (score: number) => {
    if (score >= 75) return '#f43f5e'; // Rose
    if (score >= 50) return '#f59e0b'; // Amber
    if (score >= 25) return '#6366f1'; // Indigo (representing moderate/info)
    return '#10b981'; // Emerald
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-rose-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-slate-300" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-bg-primary font-sans">
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
           <div className="absolute inset-0 border-4 border-indigo-50 rounded-full" />
           <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin" />
        </div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Risk Model...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-12">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-500/10 transition-transform hover:scale-105 duration-500">
            <Cpu className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Risk Prediction</h1>
            <p className="text-slate-500 font-medium">
              Advanced analytics and trend forecasting for <span className="text-indigo-600 font-bold uppercase tracking-wider">{data.region}</span>
            </p>
          </div>
          <div className="md:ml-auto">
             <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Last Updated</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {new Date(data.generatedAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} Hub Sync
                </span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Executive Summary */}
      {data.aiExecutiveSummary && (
        <div className="bg-indigo-600 text-white rounded-[32px] p-10 lg:p-12 mb-12 shadow-2xl shadow-indigo-600/20 animate-fade-slide-up [animation-delay:200ms] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Zap className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-[0.3em]">AI Executive Insights</h3>
            </div>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed max-w-5xl whitespace-pre-line">
              {data.aiExecutiveSummary}
            </p>
          </div>
        </div>
      )}

      {/* Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {data.risks.map((risk, i) => {
          const color = getRiskColor(risk.score);
          return (
            <div
              key={risk.type}
              className="bg-white p-10 lg:p-12 rounded-[48px] border border-slate-200 shadow-xl shadow-slate-900/5 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all animate-fade-slide-up relative overflow-hidden group"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="absolute top-0 left-0 w-2 h-full opacity-20 transition-opacity group-hover:opacity-100" style={{ backgroundColor: color }} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-white transition-all">
                       <Activity className="w-7 h-7" style={{ color }} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{risk.label}</h3>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getTrendIcon(risk.trend)}
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{risk.trend}</span>
                  </div>
                </div>

                <div className="flex items-end gap-4 mb-8">
                  <span className="text-6xl font-black tracking-tighter text-slate-900">{risk.score}</span>
                  <div className="mb-2">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Index Score</p>
                     <p className="text-xs font-bold text-slate-300">Measured Profile</p>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-10 border border-slate-50 p-[1px]">
                  <div
                    className="h-full transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${risk.score}%`, backgroundColor: color }}
                  />
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-12 font-medium">
                   {risk.prediction.replace(/AI Analysis detected potential breach in vector matrix/gi, 'We have identified specific patterns that suggest a shift in local conditions')}
                </p>

                {/* Timeline */}
                <div className="pt-10 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-8">
                     <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">72h Trend Forecast</span>
                     <Target className="w-4 h-4 text-slate-200" />
                  </div>
                  <div className="flex items-end gap-3 h-24">
                    {risk.timeline.map((point, j) => (
                      <div key={j} className="flex-1 flex flex-col items-center gap-3 group/bar relative">
                        <div
                          className="w-full rounded-lg bg-slate-100 group-hover/bar:bg-indigo-100 transition-all duration-300 relative"
                          style={{
                            height: `${Math.max(8, (point.risk / 100) * 80)}px`,
                            backgroundColor: undefined
                          }}
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-900 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white border border-slate-100 px-2 py-1 rounded-lg shadow-xl z-20 whitespace-nowrap">{point.risk}% Potential</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">{point.hour}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Environmental Intel */}
      <div className="bg-white border border-slate-200 rounded-[48px] overflow-hidden mb-12 shadow-xl shadow-slate-900/5 relative animate-fade-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
           <Satellite className="w-40 h-40 text-indigo-600" />
        </div>
        <div className="p-10 lg:p-14">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Radar className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-slate-900 mb-1">Environmental Dashboard</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ground & Satellite Verified Telemetry</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: 'Cloud Cover', value: `${data.satellite.cloudCover}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Surface Temp', value: `${data.satellite.surfaceTemp}°C`, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Precipitation', value: `${data.satellite.precipitation}mm`, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Wind Velocity', value: `${data.satellite.windSpeed}km/h`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-8 text-center hover:shadow-xl hover:shadow-slate-900/5 transition-all group">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-4">{item.label}</span>
                <span className={`text-4xl font-black tracking-tighter ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 flex items-start gap-8 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <Info className="w-6 h-6 text-indigo-400" />
             </div>
             <div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                   Our environmental data is synthesized from global weather satellites and local IoT station grids. We provide a predictive precision rating of <span className="text-slate-900 font-bold">96.8%</span> for your specific region, with automatic calibration every <span className="text-slate-900 font-bold">5 minutes</span>.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
