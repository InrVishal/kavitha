import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { RiskData } from '../types';
import { Brain, Loader2, TrendingUp, TrendingDown, Minus, Satellite, Activity, Info, Radar, Target, Shovel as Shield, Cpu } from 'lucide-react';

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
    if (score >= 75) return '#f43f5e'; // Rose (Critical)
    if (score >= 50) return '#f59e0b'; // Amber (Warning)
    if (score >= 25) return '#38bdf8'; // Sky (Intel)
    return '#10b981'; // Emerald (Safe)
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-critical" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-safe" />;
    return <Minus className="w-4 h-4 text-text-muted/40" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-bg-primary font-sans">
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center overflow-hidden">
           <Radar className="w-12 h-12 text-interactive animate-spin opacity-40" />
           <div className="absolute inset-0 border-2 border-interactive/5 rounded-full scale-150 animate-ping" />
        </div>
        <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.4em] animate-pulse">Scanning Neural Sector...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans">
      {/* Precision Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-14 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-12">
          <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
            <Cpu className="w-10 h-10 text-interactive group-hover:rotate-90 transition-transform duration-700" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white font-display tracking-tight leading-none mb-3 uppercase">Risk <span className="text-interactive">Modeling</span></h1>
            <p className="text-[15px] text-text-muted font-medium tracking-tight opacity-70">
              High-fidelity predictive analytics for sector: <span className="font-mono text-interactive font-bold uppercase tracking-[0.2em]">{data.region}</span>
            </p>
          </div>
          <div className="md:ml-auto flex flex-col items-end">
             <div className="bg-white/5 border border-white/5 px-8 py-4 rounded-[24px]">
                <span className="text-[9px] uppercase font-black text-white/20 tracking-[0.3em] block mb-2">Matrix Synchronization</span>
                <span className="text-[18px] font-mono text-white font-bold tracking-tighter uppercase whitespace-nowrap">
                  {new Date(data.generatedAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} // SECTOR_TIME
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Probability Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {data.risks.map((risk, i) => {
          const color = getRiskColor(risk.score);
          return (
            <div
              key={risk.type}
              className="soft-card group animate-fade-slide-up bg-white/2 p-12 border-white/5 hover:border-white/10 overflow-hidden relative"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full opacity-60" style={{ background: color }} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:bg-white/10 transition-all">
                       <Activity className="w-7 h-7" style={{ color }} />
                    </div>
                    <h3 className="text-[20px] font-extrabold text-white font-display tracking-tight leading-none uppercase">{risk.label}</h3>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 border-dashed">
                    {getTrendIcon(risk.trend)}
                    <span className="text-[10px] uppercase text-text-muted/60 font-black tracking-[0.2em]">{risk.trend}</span>
                  </div>
                </div>

                {/* Magnitude Index */}
                <div className="flex items-end gap-5 mb-8">
                  <span className="font-mono text-6xl font-bold tracking-tighter text-white">{risk.score}</span>
                  <div className="mb-2">
                     <p className="text-[10px] text-text-muted/30 font-black uppercase tracking-[0.3em] leading-none mb-1.5">Intensity Ratio</p>
                     <p className="text-[10px] text-white/20 font-mono font-bold tracking-widest uppercase">Cal_Index: 4.2.1</p>
                  </div>
                </div>

                {/* Intensity Visualizer */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-10 border border-white/5 p-[1px]">
                  <div
                    className="h-full transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor]"
                    style={{ width: `${risk.score}%`, backgroundColor: color, color: color }}
                  />
                </div>

                <p className="text-[15px] text-text-muted leading-relaxed mb-12 font-medium opacity-80">{risk.prediction}</p>

                {/* 72h Temporal Variance */}
                <div className="pt-10 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8 px-2">
                     <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">72h Probability Forecast</span>
                     <Target className="w-4 h-4 text-white/20" />
                  </div>
                  <div className="flex items-end gap-3 h-28">
                    {risk.timeline.map((point, j) => (
                      <div key={j} className="flex-1 flex flex-col items-center gap-3 group/bar relative">
                        <div
                          className="w-full rounded-lg opacity-20 group-hover/bar:opacity-100 transition-all duration-500 relative"
                          style={{
                            height: `${Math.max(8, (point.risk / 100) * 100)}px`,
                            background: getRiskColor(point.risk),
                          }}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 border border-white/10 px-2 py-1 rounded-lg shadow-2xl z-20">{point.risk}%</div>
                        </div>
                        <span className="text-[9px] font-mono text-text-muted/20 font-black tracking-widest uppercase">{point.hour}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Geospatial Intel Hub */}
      <div className="soft-card animate-fade-slide-up overflow-hidden border-white/5 mb-16 relative" style={{ animationDelay: '500ms' }}>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Satellite className="w-32 h-32 text-interactive" />
        </div>
        <div className="p-12">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Radar className="w-7 h-7 text-interactive" />
            </div>
            <div>
               <h3 className="text-[20px] font-black text-white font-display tracking-tight leading-none mb-2 uppercase">Multispectral Intel Layer</h3>
               <p className="text-[11px] font-black text-text-muted/30 uppercase tracking-[0.3em]">Direct Satellite Telemetry // Ground-Node IoT</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {[
              { label: 'Cloud Buffer', value: `${data.satellite.cloudCover}%`, color: '#38bdf8', icon: Activity },
              { label: 'Thermal Index', value: `${data.satellite.surfaceTemp}°C`, color: '#f43f5e', icon: Activity },
              { label: 'Hydrological', value: `${data.satellite.precipitation}mm`, color: '#f59e0b', icon: Activity },
              { label: 'Vector Velocity', value: `${data.satellite.windSpeed}km/h`, color: '#10b981', icon: Activity },
            ].map((item, i) => (
              <div key={i} className="bg-white/2 border border-white/5 rounded-[32px] p-8 text-center hover:border-white/10 hover:bg-white/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 opacity-10" style={{ background: item.color }} />
                <span className="text-[10px] uppercase font-black tracking-[0.35em] text-white/20 block mb-4 group-hover:text-white/40 transition-colors">{item.label}</span>
                <span className="font-mono text-4xl font-bold tracking-tighter text-white" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-[32px] bg-white/1 border border-white/5 flex items-start gap-8 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-interactive opacity-40 group-hover:opacity-100 transition-opacity" />
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <Info className="w-6 h-6 text-interactive/60" />
             </div>
             <div>
                <p className="text-[14px] text-text-muted leading-relaxed font-medium opacity-80">
                   Intelligence algorithms utilize multispectral satellite imagery cross-referenced with ground-level IoT sensors. Data precision: <span className="text-white font-bold">96.8%</span> within 12km radius. Predictive drift is corrected every <span className="text-white font-bold">300ms</span>.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
