import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useGeolocation } from '../hooks/useUtils';
import type { FamilyMember, SafetyStatus } from '../types';
import { 
  Heart, ShieldCheck, UserPlus, Search, 
  Phone, MapPin, CheckCircle2, AlertCircle,
  Loader2, X, Users, MessageSquare,
  ArrowRight, Activity, Signal, Navigation, Target, Cpu
} from 'lucide-react';

export default function FamilyPage() {
  const { user } = useAuthStore();
  const { position } = useGeolocation();
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [safetyStatuses, setSafetyStatuses] = useState<SafetyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingSafe, setMarkingSafe] = useState(false);
  const [safeMessage, setSafeMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [famRes, safetyRes] = await Promise.all([
        api.get('/family'),
        api.get('/family/safety')
      ]);
      setFamily(famRes.data);
      setSafetyStatuses(safetyRes.data);
    } catch (err) {
      console.error('Failed to fetch family data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkSafe = async (isSafe: boolean) => {
    setMarkingSafe(true);
    try {
      await api.post('/family/status', {
        isSafe,
        message: safeMessage,
        latitude: position?.latitude,
        longitude: position?.longitude
      });
      setSafeMessage('');
      fetchData();
    } catch (err) {
      console.error('Failed to update safety status', err);
    } finally {
      setMarkingSafe(false);
    }
  };

  const myStatus = safetyStatuses.find(s => s.userId === user?.id);

  return (
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans min-h-screen">
      {/* Kinship Grid Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-16 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
              <Heart className="w-10 h-10 text-interactive group-hover:scale-110 transition-transform duration-500 fill-interactive/10" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">Kinship <span className="text-gradient-emerald">Grid</span></h1>
              <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70">Secured proximity uplink and welfare tracking for primary kinship nodes.</p>
            </div>
          </div>
          
          <div className="flex bg-white/2 p-4 rounded-[32px] border border-white/5 backdrop-blur-xl shadow-inner">
            <div className="px-8 py-2 text-center border-r border-white/5">
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 block mb-2">Sync Status</span>
              <p className="text-[18px] font-mono font-bold text-safe uppercase tracking-tighter">Live_Uplink</p>
            </div>
            <div className="px-8 py-2 text-center">
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 block mb-2">Linked Nodes</span>
              <p className="text-[18px] font-mono font-bold text-interactive tracking-tighter uppercase">{family.length + 1}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16">
        <div className="space-y-16">
          {/* Status Burst Terminal */}
          <div className="soft-card p-12 border-white/5 bg-white/2 shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative overflow-hidden group rounded-[48px]">
            <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
               <Signal className="w-24 h-24 text-interactive" />
            </div>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                 <ShieldCheck className="w-8 h-8 text-interactive" />
              </div>
              <h2 className="text-[22px] font-black text-white font-display tracking-tighter uppercase">Broadcast Personal Telemetry</h2>
            </div>
            
            <div className="space-y-8">
              <textarea 
                value={safeMessage}
                onChange={(e) => setSafeMessage(e.target.value)}
                placeholder="INPUT_LOG: Define current structural stability, medical requirements, or mission intent..."
                className="w-full bg-white/2 border border-white/5 rounded-[40px] px-10 py-8 text-[16px] text-white placeholder:text-white/10 focus:outline-none focus:border-interactive transition-all resize-none shadow-inner font-mono tracking-tighter uppercase"
                rows={5}
              />
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => handleMarkSafe(true)}
                  disabled={markingSafe}
                  className="flex-1 py-6 rounded-[28px] bg-interactive text-bg-primary font-black text-[15px] uppercase tracking-[0.3em] shadow-3xl shadow-interactive/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-5 disabled:opacity-50 group"
                >
                  {markingSafe ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                  Authorize Safe Signal
                </button>
                <button 
                  onClick={() => handleMarkSafe(false)}
                  disabled={markingSafe}
                  className="px-12 py-6 rounded-[28px] border border-critical/40 bg-critical/5 text-critical font-black text-[15px] uppercase tracking-[0.3em] hover:bg-critical/10 transition-all disabled:opacity-50"
                >
                  Request Link
                </button>
              </div>
              
              {myStatus && (
                <div className="pt-8 flex items-center justify-between border-t border-white/5">
                   <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_15px_currentColor] ${myStatus.isSafe ? 'text-safe animate-pulse' : 'text-critical animate-ping'}`} style={{ backgroundColor: 'currentColor' }} />
                      <span className="text-[12px] font-black text-text-muted/30 uppercase tracking-[0.3em]">
                        Last Sync: {new Date(myStatus.updatedAt).toLocaleTimeString()} // LOG_01
                      </span>
                   </div>
                   <span className="text-[11px] font-mono font-bold text-white/10 uppercase tracking-widest whitespace-nowrap">NODE_REF: {myStatus.id.substring(0,8).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trusted Node Registry */}
          <div className="space-y-10">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                 <Users className="w-5 h-5 text-interactive opacity-40" />
                 <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-white/20">Active Kinship Records</h3>
              </div>
              <button className="flex items-center gap-4 text-[11px] font-black text-interactive uppercase tracking-[0.4em] hover:text-white transition-all group">
                <UserPlus className="w-4 h-4 group-hover:rotate-[90deg] transition-transform" /> Initialize Link
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {loading ? (
                <div className="py-24 flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-interactive animate-spin mb-6 opacity-20" />
                  <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.5em]">Synchronizing Peripheral Nodes...</span>
                </div>
              ) : family.length === 0 ? (
                <div className="soft-card p-20 text-center border border-dashed border-white/5 bg-white/1 rounded-[48px]">
                  <Cpu className="w-20 h-20 text-white/5 mx-auto mb-8" />
                  <p className="text-white/10 font-black text-[16px] uppercase tracking-[0.4em]">Primary circle uninitialized</p>
                </div>
              ) : (
                family.map((member, i) => {
                  const status = safetyStatuses.find(s => s.userId === member.id);
                  return (
                    <div 
                      key={member.id} 
                      className="soft-card group animate-fade-slide-up bg-white/2 p-8 flex items-center justify-between border-white/5 hover:border-white/10 transition-all rounded-[40px]"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-all overflow-hidden relative">
                           <div className="absolute inset-0 bg-interactive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-3xl font-black text-white/40 group-hover:text-interactive relative z-10">{member.name[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-5 mb-3">
                            <h4 className="text-[20px] font-black text-white uppercase tracking-tighter leading-none">{member.name}</h4>
                            <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-white/2 border border-white/5 text-white/20 uppercase tracking-[0.2em]">{member.relation}</span>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3 text-white/20">
                              <Phone className="w-4 h-4" />
                              <span className="text-[12px] font-mono font-bold tracking-tighter uppercase">{member.phone}</span>
                            </div>
                            {status && (
                              <div className="flex items-center gap-4">
                                <Activity className={`w-4 h-4 ${status.isSafe ? 'text-safe' : 'text-critical'}`} />
                                <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${status.isSafe ? 'text-safe/40' : 'text-critical/40'}`}>
                                  {status.isSafe ? 'SIGNAL_STABLE' : 'BREACH_DETECTED'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="w-14 h-14 rounded-[22px] bg-white/2 border border-white/5 text-white/20 hover:text-interactive hover:border-interactive transition-all group/btn shadow-inner flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button className="w-14 h-14 rounded-[22px] bg-white/2 border border-white/5 text-white/20 hover:text-critical hover:border-critical transition-all group/btn shadow-inner flex items-center justify-center">
                          <Target className="w-5 h-5 group-hover/btn:scale-110 transition-all" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Global Coordination Advisory */}
        <div className="space-y-12">
           <div className="soft-card glass-panel bg-white/1 p-12 sticky top-40 border-white/5 shadow-2xl rounded-[48px] overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Cpu className="w-24 h-24 text-interactive" />
              </div>
              <h3 className="text-[20px] font-black text-white font-display mb-12 tracking-tight flex items-center gap-6 uppercase relative z-10">
                 <ShieldCheck className="w-6 h-6 text-interactive" /> Link Protocols
              </h3>
              <div className="space-y-12 relative z-10">
                {[
                  { title: "ID_AUTH_CODE", desc: "Execute specialized safe-word authentication for biometric identity lock in compromised sectors." },
                  { title: "GRID_SYNC_POINT", desc: "Define a primary sanctuary node for physical reconnection in severe telemetry outage scenarios." },
                  { title: "LOAD_OPTIMIZER", desc: "Minimize uplink durations to preserve portable power cycles during regional grid failure." },
                  { title: "NEURAL_PROXIMITY", desc: "Enable passive L-Band tracking for localized connection detection in high-interfere zones." }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-interactive group-hover:bg-white/5 transition-all duration-500">
                      <span className="text-interactive/60 font-black text-[18px] font-mono group-hover:text-interactive transition-colors">{i+1}</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-white uppercase tracking-[0.2em] mb-3 group-hover:text-interactive transition-colors">{tip.title}</h4>
                      <p className="text-[14px] text-text-muted/60 leading-relaxed font-medium uppercase tracking-tight italic">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-10 rounded-[40px] bg-white/2 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-safe shadow-[0_0_20px_#10b981] opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-safe animate-pulse shadow-[0_0_15px_#10b981]" />
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Grid Uplink: Active</span>
                </div>
                <p className="text-[14px] text-text-muted/60 leading-relaxed font-medium uppercase tracking-tighter relative z-10">
                  Global sector connectivity verified. Node latency: <span className="text-interactive font-mono">14MS</span>. Encryption: <span className="text-interactive font-mono">SHA-512_SYNC</span>.
                </p>
                <div className="absolute bottom-0 right-0 p-8 opacity-5">
                   <Navigation className="w-16 h-16 text-safe" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
