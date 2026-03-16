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
        <div className="relative w-16 h-16 mb-8">
           <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Admin Dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-bg-primary font-sans p-8">
        <div className="bg-white p-12 lg:p-16 text-center max-w-xl border border-slate-200 shadow-2xl rounded-[48px] animate-fade-slide-up">
          <div className="w-24 h-24 rounded-[32px] bg-rose-50 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-rose-500/10">
             <ShieldAlert className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Access Restricted</h2>
          <p className="text-slate-500 font-medium mb-12 leading-relaxed">Administrator privileges are required to access this dashboard. Please log in with an authorized account or contact support for assistance.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'} 
            className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/20"
          >
            Go Back to Dashboard <Command className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f43f5e'; // Rose
      case 'ASSIGNED': return '#f59e0b'; // Amber
      case 'IN_PROGRESS': return '#6366f1'; // Indigo
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
    <div className="p-8 lg:p-12 max-w-7xl mx-auto font-sans min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-10 animate-fade-slide-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <Settings className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Response Center</h1>
            <p className="text-slate-500 font-medium">Coordinate emergency requests and responder assignments across the region.</p>
          </div>
        </div>
        <div className="hidden md:block relative z-10">
           <div className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-tight whitespace-nowrap">Authorized Access</span>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: AlertTriangle, label: 'Active Incidents', value: incidents, color: '#f43f5e', sub: `${data.metrics.pendingHelpRequests} Pending` },
          { icon: Radar, label: 'Help Requests', value: helpReqs, color: '#f59e0b', sub: `Recent Queue` },
          { icon: Users, label: 'Volunteers', value: volunteers, color: '#10b981', sub: `${data.metrics.availableVolunteers} Available` },
          { icon: Building2, label: 'Resources', value: resources, color: '#6366f1', sub: `${data.metrics.totalShelters} Shelters` },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 border border-slate-200 shadow-xl shadow-slate-900/5 rounded-[40px] animate-fade-slide-up group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <item.icon className="w-12 h-12 text-slate-900" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform" style={{ color: item.color }}>
                 <item.icon className="w-7 h-7" />
              </div>
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">{item.label}</div>
            <div className="text-4xl font-black text-slate-900 mb-2 leading-none">{item.value}</div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 shadow-xl shadow-slate-900/5 rounded-[48px] overflow-hidden animate-fade-slide-up">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">Request Management</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ongoing emergency support flow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.recentHelpRequests.length} Active Records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                {['ID', 'Category', 'Location', 'Urgency', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-widest font-bold text-slate-400 px-10 py-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentHelpRequests.map((req, i) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/30 transition-all group"
                  style={{ animationDelay: `${400 + i * 50}ms` }}
                >
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-indigo-600">#{req.id.substring(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-slate-700 capitalize">{req.type}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-3.5 h-3.5 text-slate-300" />
                       <span className="text-xs font-medium text-slate-400 tabular-nums">
                        {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-lg border uppercase tracking-widest ${
                      req.urgency.toLowerCase() === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      req.urgency.toLowerCase() === 'high' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>{req.urgency}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(req.status) }} />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{req.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {req.status === 'PENDING' ? (
                      <button
                        onClick={() => handleAssign(req.id)}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/10"
                      >
                        Assign Team
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500">
                         <ShieldCheck className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Coordinated</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {data.recentHelpRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <ShieldCheck className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <p className="text-slate-300 font-bold text-lg uppercase tracking-widest">All requests handled</p>
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
