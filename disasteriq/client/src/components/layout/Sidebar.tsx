import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Building2, Users, Heart, Package, 
  Map as MapIcon, ShieldAlert, Brain, Settings,
  LogOut, LayoutDashboard, Menu, X, FileSearch,
  Activity, Zap, Compass, Shield, Navigation
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/emergency', label: 'Emergency SOS', icon: ShieldAlert, highlight: true },
  { path: '/evacuation', label: 'Safety Routes', icon: Navigation },
  { path: '/scenarios', label: 'Process Guide', icon: Activity },
  { path: '/volunteers', label: 'Volunteers Hub', icon: Users },
  { path: '/shelters', label: 'Nearby Shelters', icon: Building2 },
  { path: '/family', label: 'My Family', icon: Heart },
  { path: '/resources', label: 'Supply Center', icon: Package },
  { path: '/damage', label: 'Report Damage', icon: FileSearch },
  { path: '/ai-risk', label: 'Risk Analysis', icon: Brain },
  { path: '/admin', label: 'Admin Panel', icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN' && user?.role !== 'AUTHORITY') return false;
    return true;
  });

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-interactive text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar aside */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[270px] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out transform
        lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Branding */}
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Shield className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Disaster<span className="text-indigo-600">IQ</span></h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live & Secure</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 px-4 mb-4 block">Navigation</span>
            {filteredItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all group relative
                  ${item.highlight ? 'bg-rose-500 text-white mb-6 shadow-lg shadow-rose-500/20' : ''}
                  ${isActive && !item.highlight ? 'bg-indigo-50 text-indigo-700' : ''}
                  ${!isActive && !item.highlight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="tracking-tight">{item.label}</span>
                    
                    {isActive && !item.highlight && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Module */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 mb-4 group cursor-pointer hover:border-indigo-200 transition-all shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                   <span className="text-lg font-bold text-slate-500">{(user?.name || 'A')[0]}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-slate-900 truncate leading-none mb-1">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'Rescuer'}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide uppercase text-[11px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 lg:hidden animate-fade-in"
        />
      )}
    </>
  );
}
