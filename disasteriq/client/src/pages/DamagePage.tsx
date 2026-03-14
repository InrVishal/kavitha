import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { useGeolocation } from '../hooks/useUtils';
import {
  FileWarning, Building2, Zap, Droplets, Car,
  Trees, Radio, Construction, Loader2, CheckCircle2, Upload, X,
  MapPin, AlertCircle, ShieldCheck, Activity, Camera, Layers, Target, ShieldAlert, Cpu
} from 'lucide-react';

const damageTypes = [
  { id: 'building', label: 'Civic Asset', icon: Building2, color: '#f43f5e' },
  { id: 'road', label: 'Transit Grid', icon: Car, color: '#f59e0b' },
  { id: 'power', label: 'Energy Node', icon: Zap, color: '#f59e0b' },
  { id: 'water', label: 'Hydro Asset', icon: Droplets, color: '#38bdf8' },
  { id: 'telecom', label: 'Comm Relay', icon: Radio, color: '#818cf8' },
  { id: 'environment', label: 'Eco-Sector', icon: Trees, color: '#10b981' },
];

const schema = z.object({
  type: z.string().min(1, 'Classification required for operational sync'),
  severity: z.enum(['MINOR', 'MODERATE', 'SEVERE', 'CATASTROPHIC']),
  description: z.string().min(10, 'Manifest requires detailed structural log (10+ characters)'),
});

type FormData = z.infer<typeof schema>;

export default function DamagePage() {
  const { position } = useGeolocation();
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: '', severity: 'MODERATE', description: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/damage-reports', {
        ...data,
        latitude: position?.latitude || 28.6139,
        longitude: position?.longitude || 77.2090,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 bg-bg-primary font-sans text-center">
        <div className="soft-card glass-panel p-16 max-w-xl w-full animate-fade-slide-up border-safe/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] rounded-[48px]">
          <div className="w-24 h-24 rounded-[32px] bg-safe/10 border border-safe/20 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-safe/20 overflow-hidden relative group">
             <div className="absolute inset-0 bg-safe/20 animate-pulse" />
             <CheckCircle2 className="w-12 h-12 text-safe relative z-10" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 font-display tracking-tighter uppercase">Intel Logged</h2>
          <p className="text-[16px] text-text-muted mb-12 leading-relaxed font-medium opacity-80 px-4">
            Your structural assessment has been synchronized with the regional command grid. Engineering nodes are now calculating recovery priorities for this sector.
          </p>
          
          <button
            onClick={() => { setSuccess(false); setSelectedType(''); setFile(null); }}
            className="w-full py-6 rounded-[24px] bg-interactive text-bg-primary font-black uppercase tracking-[0.3em] text-[14px] shadow-3xl shadow-interactive/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Log Matrix Observation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 lg:p-16 max-w-6xl mx-auto font-sans min-h-screen">
      {/* Assessment Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-14 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-warning/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-12">
          <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
            <Construction className="w-10 h-10 text-warning group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">Asset <span className="text-gradient-electric">Intel</span></h1>
            <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70 italic">Infrastructure breach reporting and structural integrity assessment terminal.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-14 animate-fade-slide-up [animation-delay:150ms]">
        {/* Classification Pulse */}
        <div>
          <div className="flex items-center gap-4 mb-8 ml-2">
             <Layers className="w-5 h-5 text-interactive opacity-60" />
             <label className="text-[12px] uppercase font-black tracking-[0.4em] text-white/30 leading-none">Asset Classification</label>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {damageTypes.map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => { setSelectedType(type.id); setValue('type', type.id); }}
                className={`flex flex-col items-start gap-6 p-8 rounded-[36px] border transition-all duration-500 hover:scale-[1.02] active:scale-98 group overflow-hidden relative ${
                   selectedType === type.id
                    ? 'bg-white/5 border-interactive shadow-2xl shadow-interactive/10'
                    : 'bg-white/2 border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                {selectedType === type.id && (
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-interactive" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 shadow-md" style={{ color: type.color }}>
                  <type.icon className="w-8 h-8" />
                </div>
                <span className={`text-[14px] font-black uppercase tracking-[0.2em] ${selectedType === type.id ? 'text-white' : 'text-text-muted'}`}>{type.label}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className="text-[12px] text-critical font-black uppercase tracking-widest mt-6 px-4">{errors.type.message}</p>}
        </div>

        {/* Observation Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-12">
            {/* GPS Telemetry Matrix */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Node Coordinates</label>
              <div className="bg-white/2 border border-white/5 rounded-[28px] px-10 py-6 font-mono text-[18px] text-white font-bold flex items-center justify-between shadow-inner relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                    <Target className="w-12 h-12 text-interactive" />
                 </div>
                 <div className="flex items-center gap-5 relative z-10">
                    <MapPin className="w-5 h-5 text-interactive/40 animate-pulse" />
                    <span className="tracking-widest">{position?.latitude?.toFixed(6) || '28.6139'}N // {position?.longitude?.toFixed(6) || '77.2090'}E</span>
                 </div>
                 <div className="w-2.5 h-2.5 rounded-full bg-safe shadow-[0_0_15px_#10b981] animate-pulse relative z-10" />
              </div>
            </div>

            {/* Severity Gradient */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Intensity Assessment</label>
              <select
                {...register('severity')}
                className="w-full bg-white/2 border border-white/5 rounded-[28px] px-10 py-6 text-[15px] text-white font-bold uppercase tracking-widest focus:outline-none focus:border-interactive transition-all appearance-none cursor-pointer h-[75px]"
              >
                <option value="MINOR">ALPHA :: Minor Anomaly</option>
                <option value="MODERATE">BETA :: Moderate Compromise</option>
                <option value="SEVERE">GAMMA :: Severe Breach</option>
                <option value="CATASTROPHIC">OMEGA :: Total Asset Loss</option>
              </select>
            </div>

            {/* Manifest Log */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Structural Manifest</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="INPUT_LOG: Defined structural breaches, hazardous exposure, or utility failure..."
                className="w-full bg-white/2 border border-white/5 rounded-[40px] px-10 py-8 text-[16px] text-white placeholder:text-white/10 focus:outline-none focus:border-interactive transition-all resize-none shadow-inner font-mono tracking-tighter uppercase"
              />
              {errors.description && <p className="text-[11px] text-critical font-black uppercase tracking-widest mt-2 ml-4">{errors.description.message}</p>}
            </div>
          </div>

          <div className="space-y-12">
            {/* Optical Relay */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-2">Optical Sensor Uplink</label>
              <div
                className={`border-2 border-dashed rounded-[48px] p-12 text-center transition-all duration-500 cursor-pointer min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden group ${
                  dragActive ? 'border-interactive bg-interactive/5' : 'border-white/5 bg-white/1 hover:border-interactive/20'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                   <Cpu className="w-24 h-24 text-interactive" />
                </div>
                {file ? (
                  <div className="space-y-8 animate-fade-in relative z-10">
                    <div className="w-24 h-24 rounded-[32px] bg-safe/10 border border-safe/20 flex items-center justify-center mx-auto shadow-3xl shadow-safe/10 group">
                      <CheckCircle2 className="w-12 h-12 text-safe group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <span className="text-[16px] font-black text-white truncate max-w-[250px] block mb-3 uppercase tracking-tight">{file.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[11px] font-black uppercase text-white/20 hover:text-critical transition-colors tracking-[0.4em] px-4 py-2 rounded-xl bg-white/5">
                        PURGE_BUFFER [X]
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                       <Camera className="w-10 h-10 text-white/30 group-focus-within:text-interactive" />
                    </div>
                    <p className="text-[20px] text-white font-black mb-3 tracking-tighter uppercase">Initialize Visual Link</p>
                    <p className="text-[11px] text-text-muted/20 font-black uppercase tracking-[0.4em]">Drag JPG/PNG Registry // Max 10MB Load</p>
                  </div>
                )}
              </div>
            </div>

            {/* Protocol Advisory */}
            <div className="soft-card p-10 bg-amber-500/5 border-amber-500/10 rounded-[40px] flex gap-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 opacity-40 group-hover:opacity-100 transition-opacity" />
               <ShieldAlert className="w-10 h-10 text-amber-500/40 shrink-0 group-hover:text-amber-500 transition-colors" />
               <div className="relative z-10">
                  <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.4em] mb-3">Integrity Notice 04-B</p>
                  <p className="text-[15px] text-text-muted/60 leading-relaxed font-medium uppercase tracking-tight italic">
                    Maintain clinical distance from unstable structural nodes. Human safety overrides visual telemetry. Await engineering clearance for Tier-2 proximity.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Global Broadcast Authority */}
        <div className="pt-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-8 rounded-[40px] bg-gradient-to-r from-amber-600 to-amber-700 text-bg-primary font-black text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-8 group"
          >
            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ShieldCheck className="w-10 h-10 group-hover:scale-110 transition-transform" />}
            {loading ? 'Transmitting Data Pulse...' : 'Authorize Intel Broadcast'}
          </button>
          <div className="mt-12 flex flex-col items-center gap-6">
             <div className="flex items-center gap-5 w-full max-w-[500px]">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black text-text-muted/20 uppercase tracking-[0.5em] whitespace-nowrap">Encryption Active // RSA_SYNC</span>
                <div className="h-px flex-1 bg-white/5" />
             </div>
             <p className="text-[11px] text-text-muted/40 font-black uppercase tracking-[0.4em] max-w-xl text-center leading-relaxed">
                By authorizing this broadcast, you confirm the structural assessment for active responders. Falsified intel will be flagged for grid review.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
