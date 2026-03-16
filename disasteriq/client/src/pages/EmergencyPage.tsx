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
  { id: 'flood', label: 'Flooding', icon: Droplets, color: '#0ea5e9' },
  { id: 'fire', label: 'Fire', icon: Flame, color: '#f43f5e' },
  { id: 'medical', label: 'Medical', icon: Heart, color: '#f59e0b' },
  { id: 'rescue', label: 'Rescue', icon: Shield, color: '#10b981' },
  { id: 'structural', label: 'Structural', icon: Building2, color: '#64748b' },
  { id: 'power', label: 'Power Grid', icon: Zap, color: '#f59e0b' },
  { id: 'transport', label: 'Transport', icon: Car, color: '#6366f1' },
  { id: 'hazmat', label: 'Chemical', icon: Radio, color: '#f43f5e' },
];

const schema = z.object({
  type: z.string().min(1, 'Please select an emergency type'),
  description: z.string().min(10, 'Please provide more details (at least 10 characters)'),
  peopleCount: z.number().min(1, 'Please specify the number of people').max(10000),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  contact: z.string().min(1, 'Please provide a contact number'),
  landmark: z.string().min(1, 'Please specify a nearby landmark'),
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
    setLoading(true);
    try {
      const res = await api.post('/help-requests', {
        ...data,
        latitude: position?.latitude || 28.6139,
        longitude: position?.longitude || 77.2090,
      });
      setSuccess(res.data.id);
    } catch (err) {
      console.error('Failed to send request', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-slate-50">
        <div className="bg-white p-12 lg:p-16 max-w-2xl w-full text-center border border-slate-200 shadow-2xl rounded-[48px] animate-fade-slide-up">
          <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received</h2>
          <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium px-4">
            Help is on the way. Our emergency response team has received your coordinates and is prioritizing your request. Please stay in a safe location if possible.
          </p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-12 relative overflow-hidden group">
            <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">Request ID</p>
            <p className="text-2xl font-bold text-slate-900 tracking-wider">#{success.substring(0, 8).toUpperCase()}</p>
          </div>

          <button
            onClick={() => { setSuccess(null); setSelectedType(''); }}
            className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
          >
            Submit Another Request <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Emergency Response</h1>
            <p className="text-lg text-slate-500 font-medium">Please provide the details below for immediate assistance.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-fade-slide-up [animation-delay:150ms]">
        {/* Type Selection */}
        <div>
          <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2 mb-6 block">Type of Emergency</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyTypes.map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => { setSelectedType(type.id); setValue('type', type.id, { shouldValidate: true }); }}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border transition-all duration-300 hover:shadow-xl group relative overflow-hidden ${
                  selectedType === type.id
                    ? 'bg-white border-indigo-500 ring-4 ring-indigo-500/5 shadow-2xl shadow-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${selectedType === type.id ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                  <type.icon className="w-7 h-7" style={{ color: selectedType === type.id ? '#4f46e5' : type.color }} />
                </div>
                <span className={`text-[13px] font-bold ${selectedType === type.id ? 'text-indigo-600' : 'text-slate-600'}`}>{type.label}</span>
                {selectedType === type.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
          {errors.type && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-6 px-4">{errors.type.message}</p>}
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2">Describe the situation</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Ex: Water entering the first floor, families trapped on the roof..."
                className="w-full bg-white border border-slate-200 rounded-[32px] px-8 py-6 text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-sm"
              />
              {errors.description && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-2 ml-4">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2">People Needing Help</label>
                <div className="relative">
                   <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input
                    type="number"
                    {...register('peopleCount', { valueAsNumber: true })}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
                {errors.peopleCount && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-2 ml-4">{errors.peopleCount.message}</p>}
              </div>
              <div className="space-y-4">
                <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2">Urgency Level</label>
                <select
                  {...register('urgency')}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 h-[60px] cursor-pointer shadow-sm appearance-none"
                >
                  <option value="low">Low - General support</option>
                  <option value="medium">Medium - Required soon</option>
                  <option value="high">High - Action required</option>
                  <option value="critical">Critical - Immediate help</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2">Contact Number</label>
              <div className="relative group">
                <Radio className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  {...register('contact')}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="Your phone number"
                />
              </div>
              {errors.contact && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-2 ml-4">{errors.contact.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-[0.3em] text-slate-400 ml-2">Nearby Landmark</label>
              <div className="relative group">
                <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  {...register('landmark')}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="School, Shop, Bridge, etc."
                />
              </div>
              {errors.landmark && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-2 ml-4">{errors.landmark.message}</p>}
            </div>

            <div className="p-8 bg-indigo-600 rounded-[32px] text-white shadow-xl shadow-indigo-600/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <MapPin className="w-16 h-16" />
              </div>
              <p className="text-xs uppercase font-bold tracking-[0.3em] opacity-60 mb-3">Live Location Locked</p>
              <p className="text-2xl font-bold tracking-tight mb-2">
                {position?.latitude?.toFixed(4)}° N, {position?.longitude?.toFixed(4)}° E
              </p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                 <span className="text-xs font-bold opacity-80 uppercase tracking-widest">GPS Signal Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-8 rounded-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-6 group"
          >
            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ShieldAlert className="w-10 h-10" />}
            {loading ? 'Sending Request...' : 'Send Emergency Request'}
          </button>
          
          <p className="mt-8 text-center text-sm text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            By sending this request, you are alerting nearby authorities and rescue volunteers. Please keep your phone clear for incoming calls.
          </p>
        </div>
      </form>
    </div>
  );
}
