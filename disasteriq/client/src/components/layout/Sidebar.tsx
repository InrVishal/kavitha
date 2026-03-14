import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Building2, Users, Heart, Package, 
  Map as MapIcon, ShieldAlert, Brain, Settings,
  LogOut, LayoutDashboard, Menu, X, FileSearch,
  Activity, Zap, Compass, Shield
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Tactical Room', icon: Compass },
  { path: '/emergency', label: 'SOS Protocol', icon: ShieldAlert, highlight: true },
  { path: '/volunteers', label: 'Responder Roster', icon: Users },
  { path: '/shelters', label: 'Safe Havens', icon: Building2 },
  { path: '/family', label: 'Family Status', icon: Heart },
  { path: '/resources', label: 'Asset Pledges', icon: Package },
  { path: '/damage', label: 'Repair Intel', icon: FileSearch },
  { path: '/ai-risk', label: 'Risk Modeling', icon: Brain },
  { path: '/admin', label: 'Sector Control', icon: Settings, adminOnly: true },
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
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-interactive text-bg-primary shadow-2xl shadow-interactive/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar aside */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[280px] bg-bg-panel border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out transform
        lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        font-sans
      `}>
        {/* Branding */}
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-4 mb-12 group cursor-pointer px-2">
            <div className="w-12 h-12 rounded-2xl bg-interactive flex items-center justify-center shadow-lg shadow-interactive/20 group-hover:rotate-12 transition-all">
              <Shield className="w-6 h-6 text-bg-primary fill-bg-primary" />
            </div>
            <div>
              <h2 className="text-[22px] font-extrabold text-white tracking-tight font-display leading-none mb-1">Disaster<span className="text-interactive">IQ</span></h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-safe shadow-[0_0_8px_#10b981]" />
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-text-muted/60">System Stable</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-white/20 px-4 mb-4 block">Strategic Grid</span>
            {filteredItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all group relative
                  ${item.highlight ? 'bg-critical text-white mb-6 shadow-xl shadow-critical/20' : ''}
                  ${isActive && !item.highlight ? 'bg-white/5 text-interactive border border-white/10 ring-1 ring-white/5' : ''}
                  ${!isActive && !item.highlight ? 'text-text-muted hover:text-white hover:bg-white/5' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="tracking-tight">{item.label}</span>
                    
                    {isActive && !item.highlight && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-interactive shadow-[0_0_10px_#10b981]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Module */}
        <div className="p-6 border-t border-white/5 bg-bg-panel/40 backdrop-blur-md">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5 mb-4 group cursor-pointer hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-bg-card border border-white/10 flex items-center justify-center overflow-hidden">
                   <span className="text-xl font-black text-white/60">{(user?.name || 'A')[0]}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-safe border-4 border-bg-panel" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-extrabold text-white truncate leading-none mb-1.5">{user?.name || 'Iner-Node'}</p>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{user?.role || 'Citizen'}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[14px] font-bold text-text-muted hover:text-critical hover:bg-critical/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="tracking-widest uppercase text-[11px]">Sever Uplink</span>
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
