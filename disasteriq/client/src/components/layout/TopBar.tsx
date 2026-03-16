import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Bell, Clock, ShieldCheck, Heart, 
  Wifi, WifiOff, MapPin, Search,
  Radar, Activity, Cpu, Radio
} from 'lucide-react';

const alertTicker = [
  "Note: Safety routes have been updated for the Southern Corridor.",
  "System connectivity is stable and performing well.",
  "New emergency supplies are arriving at local community centers.",
  "Weather forecasts have been updated for the next 24 hours."
];

export default function TopBar() {
  const { user } = useAuthStore();
  const [time, setTime] = useState(new Date());
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const ticker = setInterval(() => setTickerIndex(i => (i + 1) % alertTicker.length), 5000);
    
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
    <div className="h-[72px] border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-30 sticky top-0">
      {/* Live Feed */}
      <div className="flex-1 max-w-2xl overflow-hidden hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider leading-none">Live Updates</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative h-6">
          <div 
            className="flex flex-col transition-all duration-700 ease-in-out absolute w-full"
            style={{ transform: `translateY(-${tickerIndex * 24}px)` }}
          >
            {alertTicker.map((text, i) => (
              <div key={i} className="h-6 flex items-center">
                <span className="text-[13px] font-semibold text-slate-500 truncate">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Stats */}
      <div className="flex items-center gap-8">
        {/* Network & Time */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-default">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide hidden xl:inline">
              {isOnline ? 'Network Active' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Clock className="w-4 h-4 text-indigo-600 opacity-70" />
            <span className="text-[14px] font-bold text-slate-700 tabular-nums">
              {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
          <div className="hidden md:block text-right">
            <p className="text-[14px] font-bold text-slate-900 leading-none mb-1">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider leading-none">{user?.role || 'Guest'}</p>
          </div>
          <div className="relative group cursor-pointer">
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-slate-200 transition-all">
                <span className="text-[15px] font-bold text-slate-500">{(user?.name || 'A')[0]}</span>
             </div>
             <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
