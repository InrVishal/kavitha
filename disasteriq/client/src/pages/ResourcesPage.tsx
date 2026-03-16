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
  'water': '#0ea5e9',
  'medical': '#ef4444',
  'supplies': '#6366f1',
  'food': '#f59e0b',
  'equipment': '#64748b'
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
    <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Gift className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Supply Coordination</h1>
              <p className="text-slate-500 font-medium">Real-time inventory and resource allocation across all sectors.</p>
            </div>
          </div>
          <div className="bg-slate-50 px-8 py-5 rounded-[32px] border border-slate-100 flex items-center divide-x divide-slate-200 shadow-sm">
            <div className="pr-8">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Stock Status</p>
              <p className="text-xl font-bold text-slate-900">82% <span className="text-xs text-emerald-500 font-bold ml-1">Normal</span></p>
            </div>
            <div className="pl-8 flex items-center">
               <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                  <Activity className="w-5 h-5 text-indigo-600" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-6">
             <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
             <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin" />
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Inventory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res, i) => {
            const Icon = (categoryIcons as any)[res.category] || Package;
            const color = (categoryColors as any)[res.category] || '#6366f1';
            const progress = (res.pledged / res.needed) * 100;
            const isSuccess = success === res.id;

            return (
              <div 
                key={res.id} 
                className="bg-white border border-slate-200 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-[40px] p-10 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform" style={{ color }}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{res.name}</h3>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500">{res.category}</span>
                         {progress < 30 && (
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">Low Stock</span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fulfillment</span>
                     <span className="text-sm font-bold text-slate-900">{Math.min(100, Math.round(progress))}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 rounded-full" 
                      style={{ width: `${progress}%`, backgroundColor: color }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      <span>{res.pledged} Units Provided</span>
                      <span>Target: {res.needed}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                  <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1 shadow-sm">
                    <button 
                      onClick={() => updateAmount(res.id, -1)}
                      className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-lg text-slate-900">
                      {pledgeAmounts[res.id] || 1}
                    </span>
                    <button 
                      onClick={() => updateAmount(res.id, 1)}
                      className="p-3 text-slate-300 hover:text-indigo-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => handlePledge(res.id)}
                    disabled={isSuccess}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      isSuccess 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95'
                    }`}
                  >
                    {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />}
                    <span>{isSuccess ? 'Pledged' : 'Support Supply'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-16 p-10 rounded-[48px] bg-slate-50 border border-slate-100 flex items-start gap-8 animate-fade-slide-up relative overflow-hidden group">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm group-hover:rotate-12 transition-transform">
           <AlertCircle className="w-7 h-7 text-indigo-500" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Supply Commitment Policy</h4>
          <p className="text-slate-500 leading-relaxed font-medium">
             By committing support, you help us coordinate aid more effectively. Our team will verify each pledge and contact you to arrange collection or delivery from coordinated hubs. Thank you for your contribution.
          </p>
        </div>
      </div>
    </div>
  );
}
