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
  { id: 'telecom', label: 'Comm Relay', icon: Radio, color: '#6366f1' },
  { id: 'environment', label: 'Eco-Sector', icon: Trees, color: '#10b981' },
];

const schema = z.object({
  type: z.string().min(1, 'Please select a category'),
  severity: z.enum(['MINOR', 'MODERATE', 'SEVERE', 'CATASTROPHIC']),
  description: z.string().min(10, 'Please provide a detailed description (at least 10 characters)'),
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
        latitude: position?.latitude || 17.3850,
        longitude: position?.longitude || 78.4867,
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
        <div className="bg-white p-12 lg:p-16 max-w-xl w-full animate-fade-slide-up border border-slate-200 shadow-2xl shadow-slate-900/5 rounded-[48px]">
          <div className="w-24 h-24 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10">
             <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Report Received</h2>
          <p className="text-slate-500 mb-12 leading-relaxed font-medium">
            Thank you for your report. Our teams have been notified and will prioritize repairs based on the information provided.
          </p>
          
          <button
            onClick={() => { setSuccess(false); setSelectedType(''); setFile(null); }}
            className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto font-sans min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex items-center gap-10">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <Construction className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Damage Reporting</h1>
            <p className="text-slate-500 font-medium">Help us coordinate recovery by reporting infrastructure issues in your area.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-fade-slide-up [animation-delay:150ms]">
        {/* Category */}
        <div>
          <div className="flex items-center gap-3 mb-6 ml-2">
             <Layers className="w-5 h-5 text-indigo-400" />
             <label className="text-xs uppercase font-bold tracking-widest text-slate-400">Select Category</label>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {damageTypes.map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => { setSelectedType(type.id); setValue('type', type.id); }}
                className={`flex flex-col items-start gap-4 p-8 rounded-[40px] border transition-all duration-300 group relative ${
                   selectedType === type.id
                    ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-500/5'
                    : 'bg-white border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300" style={{ color: type.color }}>
                  <type.icon className="w-7 h-7" />
                </div>
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedType === type.id ? 'text-indigo-600' : 'text-slate-500'}`}>{type.label}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className="text-xs text-rose-500 font-bold mt-4 ml-4">{errors.type.message}</p>}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* Location */}
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-widest text-slate-400 ml-2">Your Location</label>
              <div className="bg-white border border-slate-200 rounded-[32px] px-8 py-5 font-bold text-slate-900 flex items-center justify-between shadow-sm group">
                 <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm tracking-tight">{position?.latitude?.toFixed(6) || '17.3850'} • {position?.longitude?.toFixed(6) || '78.4867'}</span>
                 </div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-widest text-slate-400 ml-2">Severity Level</label>
              <select
                {...register('severity')}
                className="w-full bg-white border border-slate-200 rounded-[32px] px-8 py-5 text-sm font-bold text-slate-900 tracking-tight focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer h-[64px]"
              >
                <option value="MINOR">Minor (Superficial Damage)</option>
                <option value="MODERATE">Moderate (Partial Utility Loss)</option>
                <option value="SEVERE">Severe (Major Structural Breach)</option>
                <option value="CATASTROPHIC">Critical (Full Shutdown)</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-widest text-slate-400 ml-2">Description</label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Please describe the damage, including specific details about utility failures or hazards..."
                className="w-full bg-white border border-slate-200 rounded-[40px] px-8 py-7 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none font-medium"
              />
              {errors.description && <p className="text-xs text-rose-500 font-bold mt-2 ml-4">{errors.description.message}</p>}
            </div>
          </div>

          <div className="space-y-10">
            {/* Visual Evidence */}
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-widest text-slate-400 ml-2">Visual Evidence</label>
              <div
                className={`bg-white border-2 border-dashed rounded-[48px] p-10 text-center transition-all duration-300 cursor-pointer min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden group ${
                  dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'
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
                {file ? (
                  <div className="space-y-6 animate-fade-in relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 truncate max-w-[200px] block mb-2">{file.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[10px] font-bold uppercase text-slate-400 hover:text-rose-500 transition-colors tracking-widest">
                        Remove File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                       <Camera className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-2">Upload Photo</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Drag and drop or click to browse</p>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8 flex gap-6 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 opacity-20" />
               <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
               <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">Safety First</p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Maintain a safe distance from unstable structures. Do not enter hazardous zones. Your safety is more important than a photographic report.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-[32px] bg-indigo-600 text-white font-bold text-lg uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-6"
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
            {loading ? 'Submitting Report...' : 'Submit Damage Report'}
          </button>
          
          <div className="mt-10 flex flex-col items-center text-center">
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-lg">
                Your report will be shared with emergency responders and local authorities to help coordinate recovery efforts.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
