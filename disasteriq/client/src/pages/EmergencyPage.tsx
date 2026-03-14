import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { useGeolocation } from '../hooks/useUtils';
import {
  AlertTriangle, Flame, Droplets, Building2, Zap, Heart,
  Car, Shield, Radio, Loader2, CheckCircle2, Copy,
  ArrowRight, MapPin, HandHelping, Siren, Signal, Navigation, ShieldAlert, Cpu, Users
} from 'lucide-react';

const emergencyTypes = [
  { id: 'flood', label: 'Flood Unit', icon: Droplets, color: '#38bdf8' },
  { id: 'fire', label: 'Extinguish', icon: Flame, color: '#f43f5e' },
  { id: 'medical', label: 'Bio-Support', icon: Heart, color: '#f59e0b' },
  { id: 'rescue', label: 'Extraction', icon: Shield, color: '#10b981' },
  { id: 'structural', label: 'Sanctuary', icon: Building2, color: '#94a3b8' },
  { id: 'power', label: 'Grid Utility', icon: Zap, color: '#f59e0b' },
  { id: 'transport', label: 'Evac Vector', icon: Car, color: '#818cf8' },
  { id: 'hazmat', label: 'Containment', icon: Radio, color: '#f43f5e' },
];

const schema = z.object({
  type: z.string().min(1, 'Please choose a resource classification'),
  description: z.string().min(10, 'Manifest requirement: 10+ characters'),
  peopleCount: z.number().min(1, 'Minimum 1 occupant required').max(10000),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  contact: z.string().min(1, 'Contact uplink required for coordination'),
  landmark: z.string().min(1, 'Sector landmark required for vectoring'),
});

type FormData = z.infer<typeof schema>;

export default function EmergencyPage() {
  const { position } = useGeolocation();
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: '', description: '', peopleCount: 1, urgency: 'high' },
  });

  const onSubmit = async (data: FormData) => {
    console.log('TRANS_REQ: Initializing SOS broadcast...', data);
    setLoading(true);
    try {
      const res = await api.post('/help-requests', {
        ...data,
        latitude: position?.latitude || 28.6139,
        longitude: position?.longitude || 77.2090,
      });
      console.log('TRANS_SUCCESS: Signal locked.', res.data);
      setSuccess(res.data.id);
    } catch (err) {
      console.error('TRANS_FAIL: Protocol breach.', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 bg-bg-primary font-sans">
        <div className="soft-card glass-panel p-16 max-w-xl w-full text-center animate-fade-slide-up border-safe/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] rounded-[40px]">
          <div className="w-28 h-28 rounded-[36px] bg-safe/10 border border-safe/20 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-safe/20 overflow-hidden relative group">
            <CheckCircle2 className="w-14 h-14 text-safe relative z-10" />
            <div className="absolute inset-0 bg-safe/20 animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 font-display tracking-tighter uppercase">Signal Locked</h2>
          <p className="text-[16px] text-text-muted mb-12 leading-relaxed font-medium opacity-80 px-4">
            Command has synchronized your coordinates. Dispatch vectors are now calculating the optimal response pathway. Maintain perimeter stability.
          </p>
          
          <div className="bg-white/2 border border-white/5 rounded-[32px] p-8 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-interactive opacity-40" />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 block mb-3">Manifest Token</span>
            <span className="font-mono text-3xl font-black text-white tracking-[0.2em] uppercase">{success.substring(0, 8)}</span>
          </div>

          <button
            onClick={() => { setSuccess(null); setSelectedType(''); }}
            className="w-full py-6 rounded-[24px] bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-5 group"
          >
            Log New Request <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 lg:p-16 max-w-6xl mx-auto font-sans min-h-screen">
      {/* Protocol Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-14 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-critical/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-12">
          <div className="w-24 h-24 rounded-[32px] bg-critical/10 flex items-center justify-center shadow-3xl shadow-critical/20 border border-critical/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-critical opacity-0 group-hover:opacity-10 transition-opacity" />
            <Siren className="w-12 h-12 text-critical animate-pulse" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">SOS <span className="text-gradient-emerald">Protocol</span></h1>
            <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70">Immediate emergency broadcast terminal. All requests are prioritized by sector intensity.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-14 animate-fade-slide-up [animation-delay:150ms]">
        {/* Resource Classification */}
        <div>
          <div className="flex items-center gap-4 mb-8 ml-2">
             <Signal className="w-5 h-5 text-interactive opacity-60" />
             <label className="text-[12px] uppercase font-black tracking-[0.4em] text-white/30 leading-none">Resource Classification</label>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyTypes.map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => { setSelectedType(type.id); setValue('type', type.id, { shouldValidate: true }); }}
                className={`flex flex-col items-start gap-6 p-8 rounded-[32px] border transition-all duration-500 hover:scale-[1.02] active:scale-98 group overflow-hidden relative ${
                  selectedType === type.id
                    ? 'bg-white/5 border-interactive shadow-2xl shadow-interactive/10'
                    : 'bg-white/2 border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                {selectedType === type.id && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-interactive" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500" style={{ color: type.color }}>
                  <type.icon className="w-8 h-8" />
                </div>
                <span className={`text-[14px] font-black uppercase tracking-[0.2em] ${selectedType === type.id ? 'text-white' : 'text-text-muted'}`}>{type.label}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className="text-[12px] text-critical font-black uppercase tracking-widest mt-6 px-4">{errors.type.message}</p>}
        </div>

        {/* Transmission Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Situation Manifest</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="INPUT_DETAILS: Defined occupants, medical urgency, environmental breaches..."
                className="w-full bg-white/2 border border-white/5 rounded-[32px] px-8 py-7 text-[16px] text-white placeholder:text-white/10 focus:outline-none focus:border-interactive transition-all resize-none shadow-inner font-mono tracking-tighter"
              />
              {errors.description && <p className="text-[11px] text-critical font-black uppercase tracking-widest mt-2 ml-4">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Node Size</label>
                <div className="relative">
                   <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input
                    type="number"
                    {...register('peopleCount', { valueAsNumber: true })}
                    className="w-full bg-white/2 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[16px] text-white focus:outline-none focus:border-interactive transition-all font-mono font-bold"
                  />
                </div>
                {errors.peopleCount && <p className="text-[11px] text-critical font-black uppercase tracking-widest mt-2 ml-4">{errors.peopleCount.message}</p>}
              </div>
              <div className="space-y-4">
                <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Urgency Code</label>
                <select
                  {...register('urgency')}
                  className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] text-white font-black uppercase tracking-widest focus:outline-none focus:border-interactive h-[51px] appearance-none cursor-pointer"
                >
                  <option value="low">Alpha - Surveillance</option>
                  <option value="medium">Beta - Support</option>
                  <option value="high">Gamma - Rapid</option>
                  <option value="critical">Omega - Crisis</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-10">
             <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Comm Link Identity</label>
              <div className="relative group">
                <Radio className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                <input 
                  {...register('contact')}
                  className="w-full bg-white/2 border border-white/5 rounded-[24px] pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-mono placeholder:text-white/10"
                  placeholder="ENCRYPTED_ID / UPLINK"
                />
              </div>
              {errors.contact && <p className="text-[11px] text-critical font-black uppercase tracking-widest mt-2 ml-4">{errors.contact.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Vector Landmark</label>
              <div className="relative group">
                <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                <input 
                  {...register('landmark')}
                  className="w-full bg-white/2 border border-white/5 rounded-[24px] pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                  placeholder="Sector intersection / Structural beacon"
                />
              </div>
              {errors.landmark && <p className="text-[11px] text-critical font-black uppercase tracking-widest mt-2 ml-4">{errors.landmark.message}</p>}
            </div>

            <div className="soft-card p-8 bg-white/1 border-white/5 border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <Cpu className="w-16 h-16 text-interactive" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Telemetry Sync</span>
                <div className="w-2.5 h-2.5 rounded-full bg-safe shadow-[0_0_15px_#10b981] animate-pulse" />
              </div>
              <p className="text-[20px] font-mono font-bold text-white tracking-widest mb-3">
                {position?.latitude?.toFixed(6) || '28.6139'}N, {position?.longitude?.toFixed(6) || '77.2090'}E
              </p>
              <p className="text-[10px] uppercase font-black text-text-muted/20 tracking-[0.5em]">Precision Coordinates Locked</p>
            </div>
          </div>
        </div>

        {/* Global Broadcast */}
        <div className="pt-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-8 rounded-[40px] bg-gradient-to-r from-critical to-rose-700 text-white font-black text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-critical/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-8 group"
          >
            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ShieldAlert className="w-10 h-10 group-hover:scale-110 transition-transform" />}
            {loading ? 'Transmitting Protocol...' : 'Activate Emergency Uplink'}
          </button>
          <div className="mt-12 flex flex-col items-center gap-6">
             <div className="flex items-center gap-5 w-full max-w-[400px]">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black text-text-muted/20 uppercase tracking-[0.5em] whitespace-nowrap">Grid Sync Required</span>
                <div className="h-px flex-1 bg-white/5" />
             </div>
             <p className="text-[11px] text-text-muted/40 font-black uppercase tracking-[0.4em] max-w-lg text-center leading-relaxed">
                By activating this uplink, you are broadcasted to the unified regional responders. Secure your perimeter and await tactical reinforcement.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
