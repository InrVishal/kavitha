import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAnimatedCounter } from '../hooks/useUtils';
import type { AdminDashboard, HelpRequest } from '../types';
import {
  Settings, AlertTriangle, Users, Package, Building2,
  Loader2, ChevronDown, ShieldCheck, Activity, Siren, MapPin,
  Command, Radar, Cpu, Target, ShieldAlert
} from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const incidents = useAnimatedCounter(data?.metrics.activeIncidents || 0);
  const helpReqs = useAnimatedCounter(data?.metrics.totalHelpRequests || 0);
  const volunteers = useAnimatedCounter(data?.metrics.totalVolunteers || 0);
  const resources = useAnimatedCounter(data?.metrics.totalResources || 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-bg-primary font-sans">
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
           <Cpu className="w-12 h-12 text-interactive animate-pulse opacity-40" />
           <div className="absolute inset-0 border-t-2 border-interactive rounded-full animate-spin" />
        </div>
        <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.4em] animate-pulse">Establishing Secure Sector Link...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-bg-primary font-sans">
        <div className="soft-card p-16 text-center max-w-xl border-critical/20 bg-critical/5 shadow-[0_0_100px_rgba(244,63,94,0.1)] rounded-[40px]">
          <div className="w-24 h-24 rounded-[32px] bg-critical/10 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-critical/20">
             <ShieldAlert className="w-12 h-12 text-critical animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-white font-display mb-4 tracking-tighter uppercase">Access Breach</h2>
          <p className="text-[16px] text-text-muted font-medium mb-12 leading-relaxed opacity-80 px-4">Unauthorized terminal access detected. Admin-level biometric verification and authority privileges are required for Sector Control access.</p>
          <button onClick={() => window.location.href = '/dashboard'} className="w-full py-6 rounded-[24px] bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-5">
            Return to Situation Room <Command className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f43f5e'; // Rose
      case 'ASSIGNED': return '#f59e0b'; // Amber
      case 'IN_PROGRESS': return '#38bdf8'; // Sky
      case 'RESOLVED': return '#10b981'; // Emerald
      default: return '#94a3b8';
    }
  };

  const handleAssign = async (id: string) => {
    try {
      await api.patch(`/help-requests/${id}/assign`, { assignedTo: 'auto' });
      const r = await api.get('/admin/dashboard');
      setData(r.data);
    } catch (err) {
      console.error('Assignment failed', err);
    }
  };

  return (
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans">
      {/* Control Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-14 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-12 animate-fade-slide-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-interactive/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-10">
          <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
            <Settings className="w-10 h-10 text-interactive group-hover:rotate-[120deg] transition-transform duration-1000 ease-in-out" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white font-display tracking-tighter leading-none mb-3 uppercase">Sector <span className="text-gradient-emerald">Control</span></h1>
            <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70 italic">Verified Root Authority // Global Sector Coordination Terminal</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 relative z-10">
           <div className="px-8 py-5 rounded-[28px] bg-white/5 border border-white/5 flex flex-col items-center justify-center backdrop-blur-md">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Auth Status</span>
              <span className="text-[18px] font-mono font-bold text-safe uppercase tracking-tighter whitespace-nowrap">Root_Verified // Sector_D4</span>
           </div>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        {[
          { icon: AlertTriangle, label: 'Crisis Vectors', value: incidents, color: '#f43f5e', sub: `${data.metrics.pendingHelpRequests} UNCOORDINATED` },
          { icon: Radar, label: 'SOS Terminals', value: helpReqs, color: '#f59e0b', sub: `${data.metrics.pendingHelpRequests} IN_QUEUE` },
          { icon: Users, label: 'Responder Nodes', value: volunteers, color: '#10b981', sub: `${data.metrics.availableVolunteers} ACTIVE_UNITS` },
          { icon: Building2, label: 'Safe Anchors', value: resources, color: '#38bdf8', sub: `${data.metrics.totalShelters} HAVENS_SYNCED` },
        ].map((item, i) => (
          <div
            key={i}
            className="soft-card p-10 border-white/5 bg-white/2 animate-fade-slide-up group hover:border-white/10 hover:bg-white/3 transition-all relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
               <item.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                 <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <Activity className="w-4 h-4 text-white/5 group-hover:text-interactive transition-all" />
            </div>
            <div className="text-[10px] uppercase font-black text-text-muted/30 tracking-[0.35em] mb-1.5">{item.label}</div>
            <div className="font-mono text-5xl font-bold mb-3 tracking-tighter text-white">{item.value}</div>
            <span className="text-[10px] font-mono text-white/10 font-bold uppercase tracking-[0.4em]">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Coordination Protocol Registry */}
      <div className="soft-card overflow-hidden border-white/5 bg-white/2 shadow-[0_40px_100px_rgba(0,0,0,0.7)] rounded-[40px]">
        <div className="px-10 py-8 border-b border-white/5 bg-white/2 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <Target className="w-6 h-6 text-interactive" />
            </div>
            <div>
               <h3 className="text-[18px] font-black text-white uppercase tracking-widest leading-none mb-1.5">Dispatch Queue Protocol</h3>
               <p className="text-[10px] font-black text-text-muted/30 uppercase tracking-[0.25em]">Real-time operational coordination registry</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
             <div className="w-2.5 h-2.5 rounded-full bg-safe animate-pulse shadow-[0_0_15px_#10b981]" />
             <span className="text-[12px] font-mono font-black text-white/20 uppercase tracking-[0.4em]">{data.recentHelpRequests.length} Active Command Cycles</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/1 text-center">
                {['Node_Identifier', 'Asset_Type', 'Coordinates', 'Urgency', 'Operational_Status', 'Command_Execution'].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.3em] font-black text-white/20 px-10 py-7 font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {data.recentHelpRequests.map((req, i) => (
                <tr
                  key={req.id}
                  className="hover:bg-white/5 transition-all group animate-fade-slide-up"
                  style={{ animationDelay: `${400 + i * 50}ms` }}
                >
                  <td className="px-10 py-8">
                    <span className="font-mono text-[15px] text-interactive font-bold tracking-widest">#{req.id.substring(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[15px] font-extrabold text-white/90 uppercase tracking-tighter">{req.type}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4 group/geo">
                       <MapPin className="w-4 h-4 text-text-muted/20 group-hover/geo:text-interactive transition-colors" />
                       <span className="font-mono text-[12px] text-text-muted/40 font-bold tracking-tighter group-hover:text-text-muted/60 transition-colors uppercase">
                        {req.latitude.toFixed(4)}N // {req.longitude.toFixed(4)}E
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl border tracking-[0.3em] uppercase ${
                      req.urgency.toLowerCase() === 'critical' ? 'bg-critical/5 text-critical border-critical/10 shadow-[0_0_20px_rgba(244,63,94,0.1)]' :
                      req.urgency.toLowerCase() === 'high' ? 'bg-warning/5 text-warning border-warning/10' : 'bg-interactive/5 text-interactive border-interactive/10'
                    }`}>{req.urgency}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] animate-pulse" style={{ background: getStatusColor(req.status), color: getStatusColor(req.status) }} />
                      <span className="text-[12px] font-black text-text-muted group-hover:text-white transition-colors uppercase tracking-[0.2em]">{req.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {req.status === 'PENDING' ? (
                      <button
                        onClick={() => handleAssign(req.id)}
                        className="px-8 py-3 rounded-2xl bg-interactive text-bg-primary text-[11px] font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-interactive/10"
                      >
                        Execute Link
                      </button>
                    ) : (
                      <div className="flex items-center gap-4 text-safe/40 group-hover:text-safe transition-colors">
                         <ShieldCheck className="w-5 h-5" />
                         <span className="text-[12px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Node Coordinated</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {data.recentHelpRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <ShieldCheck className="w-20 h-20 text-safe/5 mx-auto mb-8" />
                    <p className="text-white/10 font-black text-[18px] uppercase tracking-[0.4em]">Sector Operational Records Clear</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
