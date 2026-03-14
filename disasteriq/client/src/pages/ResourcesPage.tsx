import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Resource } from '../types';
import { 
  Package, Heart, Gift, Search, 
  ArrowRight, Loader2, CheckCircle2, 
  Droplets, Zap, Utensils, ShieldCheck,
  Plus, Minus, AlertCircle, ShoppingCart,
  Target, Activity, Target as TargetIcon, Cpu
} from 'lucide-react';

const categoryIcons = {
  'water': Droplets,
  'medical': Heart,
  'supplies': Package,
  'food': Utensils,
  'equipment': Zap
};

const categoryColors = {
  'water': '#38bdf8',
  'medical': '#f43f5e',
  'supplies': '#818cf8',
  'food': '#f59e0b',
  'equipment': '#f59e0b'
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledgeAmounts, setPledgeAmounts] = useState<Record<string, number>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handlePledge = async (resourceId: string) => {
    const amount = pledgeAmounts[resourceId] || 1;
    try {
      await api.post(`/resources/${resourceId}/pledge`, { quantity: amount });
      setSuccess(resourceId);
      setTimeout(() => setSuccess(null), 3000);
      fetchResources();
      setPledgeAmounts(prev => ({ ...prev, [resourceId]: 1 }));
    } catch (err) {
      console.error('Pledge failed', err);
    }
  };

  const updateAmount = (id: string, delta: number) => {
    setPledgeAmounts(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  return (
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans min-h-screen">
      {/* Logistics Matrix Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-16 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
              <Gift className="w-10 h-10 text-interactive group-hover:scale-110 transition-transform duration-500 fill-interactive/10" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">Logistics <span className="text-gradient-emerald">Matrix</span></h1>
              <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70">Sector-wide provision coordination and supply chain synchronization terminal.</p>
            </div>
          </div>
          <div className="flex bg-white/2 p-4 rounded-[32px] border border-white/5 backdrop-blur-xl shadow-inner">
            <div className="text-right pr-8 border-r border-white/5">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 mb-2">Grid Sync</p>
              <p className="text-[18px] font-mono font-bold text-white tracking-tighter uppercase">82% <span className="text-[12px] opacity-20 ml-2">Verified</span></p>
            </div>
            <div className="pl-8 flex items-center">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  <Activity className="w-6 h-6 text-interactive animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center animate-pulse">
          <div className="relative w-20 h-20 mb-10">
             <Loader2 className="w-20 h-20 text-interactive animate-spin opacity-20" />
             <div className="absolute inset-0 border-t-2 border-interactive rounded-full animate-spin-slow" />
          </div>
          <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.5em]">Calculating Supply Flow...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {resources.map((res, i) => {
            const Icon = (categoryIcons as any)[res.category] || Package;
            const color = (categoryColors as any)[res.category] || '#f59e0b';
            const progress = (res.pledged / res.needed) * 100;
            const isSuccess = success === res.id;

            return (
              <div 
                key={res.id} 
                className="soft-card group animate-fade-slide-up bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/3 transition-all overflow-hidden rounded-[40px]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-10">
                  <div className="flex items-start justify-between mb-12">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500" style={{ color }}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-[22px] font-black text-white mb-3 font-display tracking-tight leading-none group-hover:text-interactive transition-colors uppercase">{res.name}</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-xl bg-white/2 border border-white/5" style={{ color }}>{res.category}</span>
                           <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-critical/5 border border-critical/10 shadow-inner">
                              <TargetIcon className="w-3.5 h-3.5 text-critical/60" />
                              <span className="text-[9px] font-black text-critical uppercase tracking-[0.3em] leading-none">CRITICAL_ASSET</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provision Flux Visualizer */}
                  <div className="space-y-6 mb-12">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 ml-2">
                       <span>Manifest Spectrum</span>
                       <span className="text-white font-mono tracking-tighter font-bold text-[15px]">{Math.min(100, Math.round(progress))}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px] shadow-inner">
                      <div 
                        className="h-full transition-all duration-1000 shadow-[0_0_20px_currentColor] rounded-full" 
                        style={{ width: `${progress}%`, backgroundColor: color, color: color }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white/10 tracking-[0.3em] uppercase px-2">
                        <span>{res.pledged} LOGGED_UNITS</span>
                        <span>{res.needed} QUOTA_TARGET</span>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex items-center justify-between gap-8">
                    <div className="flex items-center bg-white/2 rounded-[24px] border border-white/5 p-1.5 shadow-inner">
                      <button 
                        onClick={() => updateAmount(res.id, -1)}
                        className="p-4 hover:text-interactive text-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center font-mono font-black text-[20px] text-white tracking-widest">
                        {pledgeAmounts[res.id] || 1}
                      </span>
                      <button 
                        onClick={() => updateAmount(res.id, 1)}
                        className="p-4 hover:text-interactive text-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handlePledge(res.id)}
                      disabled={isSuccess}
                      className={`flex-1 flex items-center justify-center gap-6 py-5 rounded-[28px] font-black text-[14px] uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden relative ${
                        isSuccess 
                        ? 'bg-safe/5 text-safe border border-safe/20' 
                        : 'bg-interactive text-bg-primary shadow-3xl shadow-interactive/30 hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />}
                      <span className="relative z-10">{isSuccess ? 'PLEDGE_SYNCED' : 'AUTHORIZE_PLEDGE'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Logistics Protocol Terminal */}
      <div className="mt-20 p-12 rounded-[48px] bg-white/1 border border-white/5 flex items-start gap-12 animate-fade-slide-up relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-interactive opacity-20 group-hover:opacity-100 transition-opacity" />
        <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
           <AlertCircle className="w-8 h-8 text-interactive/40 group-hover:text-interactive transition-colors" />
        </div>
        <div>
          <h4 className="text-[18px] font-black text-white uppercase tracking-[0.4em] mb-6">Unified Logistics Advisory</h4>
          <p className="text-[15px] text-text-muted/60 leading-relaxed font-medium uppercase tracking-tighter italic">
             By authorizing a supply pledge, you establish an active node on the regional provision matrix. Sector command will calibrate a collection vector based on real-time urgency and logistical capability. Node integrity is continuously monitored via multispectral relay.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[11px] font-mono font-black text-white/10 uppercase tracking-[0.3em]">
             <Cpu className="w-4 h-4" />
             <span>Uplink Frequency: 1420MHz // Auth_Gate: OPEN </span>
          </div>
        </div>
      </div>
    </div>
  );
}
