import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Bell, Clock, ShieldCheck, Heart, 
  Wifi, WifiOff, MapPin, Search,
  Radar, Activity, Cpu, Radio
} from 'lucide-react';

const alertTicker = [
  "SYSTEM: Primary evacuation corridor mapped for Northern Sector.",
  "NETWORK: Uplink status optimal. 99.9% node connectivity.",
  "INTEL: Tactical resources mobilized in response to Sector 8 breach.",
  "STATUS: Quantum modeling synchronized. 6h prediction window active."
];

export default function TopBar() {
  const { user } = useAuthStore();
  const [time, setTime] = useState(new Date());
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const ticker = setInterval(() => setTickerIndex(i => (i + 1) % alertTicker.length), 6000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(timer);
      clearInterval(ticker);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-[64px] border-b border-white/5 bg-bg-panel/40 backdrop-blur-xl flex items-center justify-between px-10 z-30 sticky top-0 font-sans">
      {/* Tactical Feed */}
      <div className="flex-1 max-w-2xl overflow-hidden hidden lg:flex items-center gap-8">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Activity className="w-3.5 h-3.5 text-interactive" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none font-mono">Operations Feed</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative h-6">
          <div 
            className="flex flex-col transition-all duration-1000 ease-in-out absolute w-full"
            style={{ transform: `translateY(-${tickerIndex * 24}px)` }}
          >
            {alertTicker.map((text, i) => (
              <div key={i} className="h-6 flex items-center">
                <span className="text-[13px] font-medium text-text-muted/60 truncate font-mono tracking-tighter uppercase">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Matrix */}
      <div className="flex items-center gap-10">
        {/* Network & Time */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 group cursor-help px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-safe shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-critical'}`} />
            <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.3em] hidden xl:inline">
              {isOnline ? 'Uplink Stable' : 'Link Failure'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <Clock className="w-4 h-4 text-interactive opacity-60" />
            <span className="text-[14px] font-bold text-white font-mono tracking-tighter">
              {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Tactical Profile */}
        <div className="flex items-center gap-5 pl-10 border-l border-white/5">
          <div className="hidden md:block text-right">
            <p className="text-[14px] font-black text-white tracking-tight leading-none mb-1.5 uppercase">{user?.name || 'Operator Unknown'}</p>
            <div className="flex items-center gap-2 justify-end">
               <Cpu className="w-2.5 h-2.5 text-interactive" />
               <p className="text-[9px] font-black text-interactive uppercase tracking-[0.25em] leading-none">{user?.role || 'VIEWER'}</p>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[18px]">
             <div className="w-11 h-11 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/10 group-active:scale-95 transition-all shadow-inner">
                <span className="text-[15px] font-black text-white/40">{(user?.name || 'O')[0]}</span>
             </div>
             <div className="absolute inset-0 bg-interactive/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-interactive rounded-full border-2 border-bg-panel shadow-[0_0_8px_#10b981]" />
          </div>
        </div>
      </div>
    </div>
  );
}
