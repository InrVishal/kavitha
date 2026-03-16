import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useAnimatedCounter } from '../hooks/useUtils';
import type { Volunteer } from '../types';
import { 
  Users, Search, UserPlus, MapPin, 
  CheckCircle2, Clock, ShieldCheck, 
  Loader2, Globe, Heart, AlertCircle, X,
  GraduationCap, Zap, Activity, Target, Cpu
} from 'lucide-react';

export default function VolunteersPage() {
  const { user, setAuth } = useAuthStore();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [skills, setSkills] = useState('');

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/volunteers');
      setVolunteers(res.data);
    } catch (err) {
      console.error('Failed to fetch volunteers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleRegister = async () => {
    if (!skills) return;
    setRegistering(true);
    try {
      await api.post('/volunteers', {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        region: user?.region || 'metro'
      });
      
      if (user) {
        const updatedUser = { ...user, role: 'VOLUNTEER' as const };
        setAuth(updatedUser, localStorage.getItem('disasteriq_token') || '');
      }

      setShowRegister(false);
      fetchVolunteers();
    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      setRegistering(false);
    }
  };

  const filtered = volunteers.filter(v => 
    (v.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalVolunteers = useAnimatedCounter(volunteers.length);
  const activeNow = useAnimatedCounter(volunteers.filter(v => v.status === 'AVAILABLE').length);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto font-sans min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-slide-up">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-slate-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-1" />
          
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Community Volunteers</h1>
              <p className="text-slate-500 font-medium tracking-tight">Meet the dedicated responders helping our region stay safe.</p>
            </div>
          </div>
          
          {user?.role === 'CITIZEN' && (
            <button 
              onClick={() => setShowRegister(true)}
              className="mt-8 md:mt-0 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all relative z-10 flex items-center gap-3"
            >
              <Heart className="w-4 h-4 fill-current" /> Join the Team
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
          <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-xl shadow-slate-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform">
                <Globe className="w-12 h-12 text-indigo-600" />
             </div>
             <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter mb-2">{totalVolunteers}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Responders</span>
          </div>
          <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-xl shadow-slate-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:-rotate-12 transition-transform">
                <Activity className="w-12 h-12 text-emerald-600" />
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mb-4" />
             <span className="text-4xl font-black text-emerald-600 leading-none tracking-tighter mb-2">{activeNow}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Now</span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-2 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, specialist skills, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-20 pr-10 py-5 text-sm font-bold text-slate-900 focus:outline-none transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-8">
               <Loader2 className="w-16 h-16 text-indigo-100 animate-spin" />
               <div className="absolute inset-0 border-t-2 border-indigo-600 rounded-full animate-spin" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading community roster...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((v, i) => (
              <div 
                key={v.id} 
                className="bg-white group animate-fade-slide-up border border-slate-200 hover:border-indigo-500/20 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all overflow-hidden relative rounded-[48px]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 right-0 p-8 pointer-events-none">
                   <div className={`w-3 h-3 rounded-full ${v.status === 'AVAILABLE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`} />
                </div>
                
                <div className="p-10">
                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                       <span className="text-xl font-black text-indigo-600">{(v.user?.name || 'V')[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1.5">{v.user?.name || 'Volunteer'}</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{v.user?.region || 'Metro Region'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-10 min-h-[60px] content-start">
                    {v.skills.map(skill => (
                      <span key={skill} className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:border-indigo-100 transition-all">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                       <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                       <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-tight">{new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/20 animate-fade-in">
          <div className="bg-white w-full max-w-2xl overflow-hidden animate-fade-slide-up shadow-2xl rounded-[48px] border border-slate-200">
            <div className="p-10 lg:p-14">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                    <Heart className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Join the Team</h3>
                    <p className="text-sm text-slate-500 font-medium">Lend your skills to help those in need during disasters.</p>
                  </div>
                </div>
                <button onClick={() => setShowRegister(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs uppercase font-bold tracking-widest text-slate-400 ml-4">What are your skills?</label>
                  <textarea 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Medical aid, logistics, driving, heavy equipment, coordination..."
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
                  />
                  <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100 w-fit ml-4">
                     <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                     <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-none">Separate skills with commas</p>
                  </div>
                </div>

                <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex gap-6 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                   <ShieldCheck className="w-10 h-10 text-indigo-200 shrink-0" />
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                     By signing up, you agree to be contacted for emergency support. Your safety is our priority; always follow official protocols during deployment.
                   </p>
                </div>

                <button 
                  onClick={handleRegister}
                  disabled={registering || !skills}
                  className="w-full py-6 rounded-[32px] bg-indigo-600 text-white font-bold text-lg uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-6 group"
                >
                  {registering ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                  {registering ? 'Becoming a Volunteer...' : 'Sign Up Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
