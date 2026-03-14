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
      const res = await api.post('/volunteers', {
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
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans min-h-screen">
      {/* Tactical Registry Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 animate-fade-slide-up">
        <div className="lg:col-span-2 bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-10">
            <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
              <Users className="w-10 h-10 text-interactive group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">Node <span className="text-gradient-emerald">Registry</span></h1>
              <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70">Decentralized network of specialized regional responders.</p>
            </div>
          </div>
          
          {user?.role === 'CITIZEN' && (
            <button 
              onClick={() => setShowRegister(true)}
              className="mt-10 md:mt-0 px-10 py-6 rounded-[24px] bg-interactive text-bg-primary font-black text-[14px] uppercase tracking-[0.3em] shadow-3xl shadow-interactive/20 hover:scale-[1.05] active:scale-95 transition-all relative z-10 flex items-center gap-4"
            >
              <Zap className="w-5 h-5 fill-current" /> Initialize Node
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
          <div className="soft-card p-10 bg-white/2 border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                <Target className="w-12 h-12 text-interactive" />
             </div>
             <span className="text-[40px] font-mono font-bold text-white leading-none tracking-tighter mb-3">{totalVolunteers}</span>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Global Roster</span>
          </div>
          <div className="soft-card p-10 bg-white/2 border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:-rotate-12 transition-transform">
                <Cpu className="w-12 h-12 text-safe" />
             </div>
             <div className="w-2.5 h-2.5 rounded-full bg-safe shadow-[0_0_15px_#10b981] animate-pulse mb-6" />
             <span className="text-[40px] font-mono font-bold text-safe leading-none tracking-tighter mb-3">{activeNow}</span>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Live Matrix</span>
          </div>
        </div>
      </div>

      {/* Roster Matrix */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-white/1 p-3 rounded-[40px] border border-white/5">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/30 group-focus-within:text-interactive transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH_BY_NODE: NAME, SKILLSET, OR SECTOR_ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-20 pr-10 py-6 text-[16px] text-white focus:outline-none transition-all font-mono tracking-tighter uppercase placeholder:text-white/5"
            />
          </div>
          <div className="flex items-center gap-6 px-10 py-5 bg-white/2 rounded-[32px] border border-white/5">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] whitespace-nowrap">Filter Sequence:</span>
            <select className="bg-transparent text-[13px] font-black text-white uppercase tracking-widest outline-none cursor-pointer appearance-none">
              <option>Primary_Sort</option>
              <option>Contribution_Max</option>
              <option>Alpha_Order</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center animate-pulse">
            <div className="relative w-20 h-20 mb-10">
               <Loader2 className="w-20 h-20 text-interactive animate-spin opacity-20" />
               <div className="absolute inset-0 border-t-2 border-interactive rounded-full animate-spin-slow" />
            </div>
            <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.5em]">Synchronizing Neural Grid...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((v, i) => (
              <div 
                key={v.id} 
                className="soft-card group animate-fade-slide-up bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/3 transition-all overflow-hidden relative rounded-[36px]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 right-0 p-8 pointer-events-none">
                   <div className={`w-3.5 h-3.5 rounded-full shadow-[0_0_15px_currentColor] animate-pulse ${v.status === 'AVAILABLE' ? 'text-safe' : 'text-warning'}`} style={{ backgroundColor: 'currentColor' }} />
                </div>
                
                <div className="p-10">
                  <div className="flex items-start gap-6 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all shadow-inner">
                       <span className="text-2xl font-black text-white/40 group-hover:text-interactive transition-colors">{(v.user?.name || 'H')[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-black text-white tracking-tight leading-none mb-2 uppercase">{v.user?.name || 'NODE_UNKNOWN'}</h3>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-interactive/40 group-hover:text-interactive transition-colors" />
                        <span className="text-[11px] font-black text-text-muted/30 uppercase tracking-[0.2em]">{v.user?.region || 'GLOBAL_SECTOR'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-12 min-h-[70px] content-start">
                    {v.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-white/2 border border-white/5 rounded-xl text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] group-hover:border-white/10 transition-all cursor-crosshair">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-safe/5 border border-safe/10">
                       <ShieldCheck className="w-4 h-4 text-safe/40" />
                       <span className="text-[9px] font-black text-safe uppercase tracking-[0.3em]">Verified_Unit</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted/20">
                       <Clock className="w-4 h-4" />
                       <span className="font-mono text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">{new Date(v.createdAt).toLocaleDateString()} // SYNC</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Node Initialization Portal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-3xl bg-slate-950/70 animate-fade-in">
          <div className="soft-card glass-panel w-full max-w-2xl overflow-hidden animate-fade-slide-up shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-white/10 bg-slate-900/40 rounded-[48px]">
            <div className="p-16">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[30px] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group">
                    <UserPlus className="w-10 h-10 text-interactive animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white font-display tracking-tighter leading-none mb-3 uppercase">Neural Sync</h3>
                    <p className="text-[16px] text-text-muted font-medium opacity-60">Establish your responder signature on the tactical grid.</p>
                  </div>
                </div>
                <button onClick={() => setShowRegister(false)} className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-text-muted transition-colors opacity-40 hover:opacity-100">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-12">
                <div className="space-y-4">
                  <label className="text-[11px] uppercase font-black tracking-[0.4em] text-white/20 ml-4">Manifest Operational Skillset</label>
                  <textarea 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="CARDIOLOGY, EXTRACTION, LOGISTICS, CRYPTO_COMMS..."
                    rows={6}
                    className="w-full bg-white/2 border border-white/5 rounded-[40px] px-10 py-8 text-[16px] text-white placeholder:text-white/10 focus:outline-none focus:border-interactive transition-all resize-none shadow-inner font-mono tracking-tighter uppercase"
                  />
                  <div className="flex items-center gap-4 px-6 py-2.5 bg-white/3 rounded-2xl border border-white/5 w-fit ml-4">
                     <AlertCircle className="w-4 h-4 text-interactive/60" />
                     <p className="text-[11px] text-text-muted/40 font-black uppercase tracking-[0.3em] leading-none">Delimit skills with commas</p>
                  </div>
                </div>

                <div className="p-10 rounded-[40px] bg-white/2 border border-white/5 flex gap-8 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-interactive opacity-40 group-hover:opacity-100 transition-opacity" />
                   <ShieldCheck className="w-10 h-10 text-interactive/40 shrink-0" />
                   <p className="text-[15px] text-text-muted/60 leading-relaxed font-medium">By initializing, you agree to emergency deployment protocols. Your node will be discoverable by sector authority for high-priority mission assignment.</p>
                </div>

                <button 
                  onClick={handleRegister}
                  disabled={registering || !skills}
                  className="w-full py-8 rounded-[40px] bg-interactive text-bg-primary font-black text-[18px] uppercase tracking-[0.4em] shadow-3xl shadow-interactive/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-8 group"
                >
                  {registering ? <Loader2 className="w-8 h-8 animate-spin" /> : <Cpu className="w-8 h-8 group-hover:rotate-12 transition-transform" />}
                  {registering ? 'Activating Profile...' : 'Complete Neural Sync'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
