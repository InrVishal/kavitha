import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Shield, AlertCircle, Loader2, 
  ArrowRight, Mail, Lock, User, MapPin, 
  Zap, Globe, Activity, Cpu, Radio, ShieldCheck
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Operational link (email) is invalid'),
  password: z.string().min(6, 'Encryption key (password) must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name required for node identification'),
  email: z.string().email('Email required for grid uplink'),
  password: z.string().min(6, 'Establish a strong encryption key'),
  region: z.string().min(1, 'Sector assignment required'),
  role: z.enum(['CITIZEN', 'VOLUNTEER', 'AUTHORITY', 'ADMIN']),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const intelFlow = [
  "UPLINK: Direct satellite telemetry established for Northern Sector.",
  "LOGISTICS: High-priority resource cloud synced with local depots.",
  "PERSONNEL: 4,000+ verified responders active on the tactical grid.",
  "GRID: All care pathways optimized. Predictive risk models online."
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intelIndex, setIntelIndex] = useState(0);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    const timer = setInterval(() => setIntelIndex(i => (i + 1) % intelFlow.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ 
    resolver: zodResolver(registerSchema),
    defaultValues: { region: 'metro', role: 'CITIZEN' }
  });

  const onLogin = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.token);
      localStorage.setItem('disasteriq_token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication rejected. Verify operational credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', data);
      setAuth(res.data.user, res.data.token);
      localStorage.setItem('disasteriq_token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Grid registration failed. Network parameters mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary relative flex items-center justify-center p-8 overflow-hidden font-sans">
      {/* Tactical Background Layer */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#020617]" />
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
         {/* Grid Pattern */}
         <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-[500px] z-10">
        {/* Branding Header */}
        <div className="text-center mb-16 animate-fade-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 shadow-3xl backdrop-blur-3xl mb-10 relative group">
            <ShieldCheck className="w-10 h-10 text-interactive animate-pulse relative z-10" />
            <div className="absolute inset-0 bg-interactive/10 blur-xl opacity-40 rounded-full" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-4 font-display uppercase">
            Disaster<span className="text-interactive">IQ</span>
          </h1>
          <p className="text-[11px] text-text-muted/60 font-black uppercase tracking-[0.5em] mb-6">Tactical Response Framework</p>
          
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full border border-white/5 bg-white/2 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-interactive animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">{intelFlow[intelIndex]}</span>
          </div>
        </div>

        {/* Tactical Auth Module */}
        <div className="glass-panel overflow-hidden border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-fade-slide-up [animation-delay:150ms] rounded-[40px]">
          <div className="p-12">
            {/* Sector Selector Tabs */}
            <div className="flex bg-white/2 rounded-2xl p-1.5 mb-10 border border-white/5 mx-auto max-w-[340px]">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${isLogin ? 'bg-interactive text-bg-primary shadow-xl shadow-interactive/20' : 'text-text-muted hover:text-white'}`}
              >
                Access
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${!isLogin ? 'bg-interactive text-bg-primary shadow-xl shadow-interactive/20' : 'text-text-muted hover:text-white'}`}
              >
                Uplink
              </button>
            </div>

            {error && (
              <div className="mb-10 p-5 rounded-3xl bg-critical/5 border border-critical/10 flex items-center gap-5 animate-shake">
                <AlertCircle className="w-5 h-5 text-critical shrink-0" />
                <p className="text-[13px] font-bold text-critical/80 leading-tight uppercase tracking-tighter">{error}</p>
              </div>
            )}

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Node Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                    <input 
                      {...loginForm.register('email')}
                      className="w-full bg-white/2 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                      placeholder="operator@disasteriq.gov"
                    />
                  </div>
                  {loginForm.formState.errors.email && <p className="text-[10px] text-critical font-black uppercase tracking-widest ml-2">{loginForm.formState.errors.email.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">RSA Encryption Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                    <input 
                      type="password"
                      {...loginForm.register('password')}
                      className="w-full bg-white/2 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginForm.formState.errors.password && <p className="text-[10px] text-critical font-black uppercase tracking-widest ml-2">{loginForm.formState.errors.password.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 rounded-[32px] bg-interactive text-bg-primary font-black text-[15px] uppercase tracking-[0.3em] shadow-3xl shadow-interactive/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 group"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-5">Initialize Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></div>}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                    <input 
                      {...registerForm.register('name')}
                      className="w-full bg-white/2 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                      placeholder="Operator Name"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Node Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                    <input 
                      {...registerForm.register('email')}
                      className="w-full bg-white/2 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                      placeholder="operator@disasteriq.gov"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-2.5">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Sector</label>
                     <select 
                       {...registerForm.register('region')}
                       className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] text-white font-bold tracking-tight outline-none focus:border-interactive appearance-none"
                     >
                        <option value="metro">METRO SECTOR</option>
                        <option value="north">NORTH SECTOR</option>
                        <option value="south">SOUTH SECTOR</option>
                        <option value="west">WEST SECTOR</option>
                     </select>
                   </div>
                   <div className="space-y-2.5">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Designation</label>
                     <select 
                       {...registerForm.register('role')}
                       className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] text-white font-bold tracking-tight outline-none focus:border-interactive appearance-none"
                     >
                        <option value="CITIZEN">CITIZEN</option>
                        <option value="VOLUNTEER">VOLUNTEER</option>
                        <option value="AUTHORITY">AUTHORITY</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Encryption Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/40 group-focus-within:text-interactive transition-colors" />
                    <input 
                      type="password"
                      {...registerForm.register('password')}
                      className="w-full bg-white/2 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-[15px] text-white focus:outline-none focus:border-interactive transition-all font-medium placeholder:text-white/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 rounded-[32px] bg-interactive text-bg-primary font-black text-[15px] uppercase tracking-[0.3em] shadow-3xl shadow-interactive/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Synchronize Node'}
                </button>
              </form>
            )}

            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center">
               <div className="flex items-center gap-6 mb-8 w-full">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Operational Override</span>
                  <div className="h-px flex-1 bg-white/5" />
               </div>
               <div className="flex gap-5 w-full">
                  <button 
                    onClick={() => navigate('/emergency')}
                    className="flex-1 py-4 rounded-2xl border border-critical/40 bg-critical/5 text-critical hover:bg-critical/10 text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    SOS Access
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/10 text-white/30 text-[10px] font-mono transition-all"
                  >
                    bypass_matrix
                  </button>
               </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-[10px] text-text-muted/20 font-mono font-bold uppercase tracking-[0.4em] animate-fade-slide-up [animation-delay:400ms]">
          Comms Protocol v4.4.2 // RSA // 4096-bit Secure Link
        </div>
      </div>
    </div>
  );
}
