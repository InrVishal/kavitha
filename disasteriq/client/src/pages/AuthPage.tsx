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
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  region: z.string().min(1, 'Please select your region'),
  role: z.enum(['CITIZEN', 'VOLUNTEER', 'AUTHORITY', 'ADMIN']),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const intelFlow = [
  "Safe navigation routes have been updated for all sectors.",
  "Community response network is now active and synchronized.",
  "New emergency resource centers are opening in key regions.",
  "Real-time monitoring system is providing accurate forecasts."
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
      setError(err.response?.data?.error || 'Unable to sign in. Please check your credentials.');
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
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary relative flex items-center justify-center p-8 overflow-hidden bg-mesh">
      <div className="w-full max-w-[480px] z-10">
        {/* Branding Header */}
        <div className="text-center mb-12 animate-fade-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xl mb-8 group overflow-hidden">
            <Shield className="w-8 h-8 text-indigo-600 fill-indigo-600 transition-transform group-hover:scale-110" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Disaster<span className="text-indigo-600">IQ</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mb-8">Emergency Support & Coordination</p>
          
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-500">{intelFlow[intelIndex]}</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-900/5 animate-fade-slide-up [animation-delay:150ms] overflow-hidden">
          <div className="p-10">
            {/* Tabs */}
            <div className="flex bg-slate-50 rounded-xl p-1 mb-10 border border-slate-100">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-sm font-semibold text-rose-600 leading-tight">{error}</p>
              </div>
            )}

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      {...loginForm.register('email')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[15px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-300"
                      placeholder="name@example.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{loginForm.formState.errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="password"
                      {...loginForm.register('password')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[15px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-300"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginForm.formState.errors.password && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{loginForm.formState.errors.password.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 group"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-3">Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      {...registerForm.register('name')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[15px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-300"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      {...registerForm.register('email')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[15px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-300"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Region</label>
                     <select 
                       {...registerForm.register('region')}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none"
                     >
                        <option value="metro">Metro</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                        <option value="west">West</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">I am a</label>
                     <select 
                       {...registerForm.register('role')}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none"
                     >
                        <option value="CITIZEN">Citizen</option>
                        <option value="VOLUNTEER">Volunteer</option>
                        <option value="AUTHORITY">Authority</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="password"
                      {...registerForm.register('password')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[15px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-10 pt-8 border-t border-slate-50">
               <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/emergency')}
                    className="flex-1 py-3 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold uppercase transition-all"
                  >
                    Quick SOS
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-3 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-600 text-[11px] font-bold uppercase transition-all"
                  >
                    Explore
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
