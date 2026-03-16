import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useGeolocation } from '../hooks/useUtils';
import type { FamilyMember, SafetyStatus } from '../types';
import { 
  Heart, ShieldCheck, UserPlus, Search, 
  Phone, MapPin, CheckCircle2, AlertCircle,
  Loader2, X, Users, MessageSquare,
  ArrowRight, Activity, Signal, Navigation, Target, Cpu, Bot, Send
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker for family nodes
const familyIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-indigo-500 opacity-20 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-lg"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function FamilyPage() {
  const { user } = useAuthStore();
  const { position } = useGeolocation();
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [safetyStatuses, setSafetyStatuses] = useState<SafetyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingSafe, setMarkingSafe] = useState(false);
  const [safeMessage, setSafeMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const res = await api.post('/ai-risk/chat', { 
        message: userMsg,
        context: 'Family safety and social coordination support'
      });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setChatHistory(prev => [...prev, { role: 'ai', content: 'I am having trouble connecting right now. Please try again in a moment.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const myStatus = safetyStatuses.find(s => s.userId === user?.id);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Heart className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Family & Friends</h1>
              <p className="text-slate-500 font-medium">Keep track of your loved ones and share your safety status.</p>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-2 rounded-[32px] border border-slate-100 shadow-sm divide-x divide-slate-200">
            <div className="px-8 py-2 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Status</span>
              <p className="text-lg font-bold text-emerald-600">Connected</p>
            </div>
            <div className="px-8 py-2 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Linked</span>
              <p className="text-lg font-bold text-indigo-600">{family.length + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white border border-slate-200 rounded-[48px] overflow-hidden mb-12 h-[500px] relative shadow-xl shadow-slate-900/5 animate-fade-slide-up [animation-delay:200ms]">
        <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-xl pointer-events-auto">
             <div className="flex items-center gap-3 mb-1">
                <Navigation className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Safety Map</span>
             </div>
             <p className="text-sm font-bold text-slate-900">Registered Locations</p>
          </div>
        </div>

        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM'
          />
          
          {position && (
            <Marker position={[position.latitude, position.longitude]} icon={familyIcon}>
              <Popup className="premium-popup">
                <div className="p-4 min-w-[150px]">
                  <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Your Location</p>
                  <p className="text-[10px] text-slate-400 font-medium">Lat: {position.latitude.toFixed(4)}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Lng: {position.longitude.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {safetyStatuses.map(status => (
            status.latitude && status.longitude && (
              <Marker key={status.id} position={[status.latitude, status.longitude]} icon={familyIcon}>
                <Popup className="premium-popup">
                  <div className="p-4 min-w-[180px]">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {family.find(f => f.userId === status.userId)?.name || 'Linked Member'}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${status.isSafe ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {status.isSafe ? 'I am safe' : 'Needs assistance'}
                      </span>
                    </div>
                    {status.message && <p className="text-sm text-slate-500 italic mb-3">"{status.message}"</p>}
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Updated: {new Date(status.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-12">
          {/* Status Update */}
          <div className="bg-white border border-slate-200 rounded-[48px] p-10 lg:p-12 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <Signal className="w-32 h-32 text-indigo-600" />
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                 <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Update My Status</h2>
            </div>
            
            <div className="space-y-6">
              <textarea 
                value={safeMessage}
                onChange={(e) => setSafeMessage(e.target.value)}
                placeholder="Share a quick update with your family (e.g., 'At the community center', 'Staying with friends')"
                className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-sm"
                rows={4}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleMarkSafe(true)}
                  disabled={markingSafe}
                  className="flex-1 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {markingSafe ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  I am Safe
                </button>
                <button 
                  onClick={() => handleMarkSafe(false)}
                  disabled={markingSafe}
                  className="px-10 py-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-all disabled:opacity-50"
                >
                  I need help
                </button>
              </div>
              
              {myStatus && (
                <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${myStatus.isSafe ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Last update: {new Date(myStatus.updatedAt).toLocaleTimeString()}
                      </span>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                 <Users className="w-5 h-5 text-slate-400" />
                 <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">Connected Members</h3>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-all group">
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="py-24 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing...</span>
                </div>
              ) : family.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 p-16 text-center rounded-[48px]">
                  <Users className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                  <p className="text-slate-300 font-bold uppercase tracking-widest">No members added yet</p>
                </div>
              ) : (
                family.map((member, i) => {
                  const status = safetyStatuses.find(s => s.userId === member.id);
                  return (
                    <div 
                      key={member.id} 
                      className="bg-white p-6 lg:p-8 flex items-center justify-between border border-slate-200 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all rounded-[32px] group"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden relative">
                           <span className="text-2xl font-bold text-slate-300 group-hover:text-indigo-600 transition-colors uppercase">{member.name[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-1">
                            <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 uppercase">{member.relation}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Phone className="w-3.5 h-3.5" />
                              <span className="text-xs font-bold">{member.phone}</span>
                            </div>
                            {status && (
                              <div className="flex items-center gap-2">
                                <Activity className={`w-3.5 h-3.5 ${status.isSafe ? 'text-emerald-500' : 'text-rose-500'}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${status.isSafe ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {status.isSafe ? 'Safe' : 'Needs Help'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all shadow-sm flex items-center justify-center">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-white transition-all shadow-sm flex items-center justify-center">
                          <Target className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Support */}
        <div className="space-y-8">
           <div className="bg-white p-10 border border-slate-200 shadow-xl shadow-slate-900/5 rounded-[48px] overflow-hidden sticky top-32">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Cpu className="w-24 h-24 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-10 flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-indigo-600" /> Keep Safe
              </h3>
              <div className="space-y-10">
                {[
                  { title: "Safe Words", desc: "Decide on a family 'safe word' to confirm identities in confusing situations." },
                  { title: "Meeting Point", desc: "Agree on a physical place to meet if phone networks go down." },
                  { title: "Save Battery", desc: "Update your status quickly and keep your phone in low-power mode." },
                  { title: "Location Sharing", desc: "Allow localized tracking so family can find you even without a call." }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                      <span className="text-slate-300 font-bold text-lg group-hover:text-indigo-600 transition-colors">{i+1}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{tip.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 rounded-[32px] bg-indigo-600 text-white relative overflow-hidden group shadow-xl shadow-indigo-600/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Network Active</span>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Global satellite connectivity is currently stable. Latency: <span className="font-bold">14ms</span>.
                </p>
                <div className="absolute bottom-0 right-0 p-6 opacity-10">
                   <Navigation className="w-12 h-12" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="fixed bottom-10 right-10 z-[2000] flex flex-col items-end gap-6">
        {isAiOpen && (
          <div className="w-[400px] h-[600px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-fade-slide-up">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Safety Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Always here for you</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="bg-white w-10 h-10 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 text-sm text-slate-600 leading-relaxed font-medium">
                  Hello! I'm here to help you stay connected with your family and ensure everyone is safe. You can ask me about regional risks or how to coordinate with your loved ones.
                </div>
              </div>
              
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl border shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-600 border-indigo-500' : 'bg-white border-slate-200'
                  }`}>
                    {msg.role === 'user' ? <Users className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className={`rounded-2xl p-5 text-sm leading-relaxed font-medium shadow-sm transition-all ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 border border-slate-100 text-slate-600 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChat} className="p-8 border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all pr-14"
                />
                <button 
                  type="submit"
                  disabled={isChatLoading || !chatMessage.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-16 h-16 lg:w-20 lg:h-20 rounded-[28px] lg:rounded-[32px] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 relative group overflow-hidden ${
            isAiOpen ? 'bg-white border border-slate-200 rotate-90' : 'bg-indigo-600 border border-indigo-500 shadow-indigo-600/30'
          }`}
        >
          {isAiOpen ? <X className="w-8 h-8 text-slate-900" /> : <Bot className="w-8 h-8 text-white" />}
          {!isAiOpen && (
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          )}
        </button>
      </div>
    </div>
  );
}
