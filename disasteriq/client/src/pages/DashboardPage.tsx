import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import { getSocket } from '../services/socket';
const socket = getSocket();
import { useAnimatedCounter } from '../hooks/useUtils';
import type { Incident, HelpRequest, Shelter, WeatherData } from '../types';
import { 
  AlertTriangle, Users, Heart, Package, Activity, 
  Map as MapIcon, Layers, Thermometer, Wind, Droplets,
  Clock, ArrowUpRight, Search, Zap, Loader2, Bell, ShieldAlert,
  Radar, Activity as Pulse, Compass, Shield, Target, Cpu, Radio, Siren
} from 'lucide-react';

// Titanium precision markers
const createIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-5 h-5 rounded-full opacity-20 animate-ping" style="background-color: ${color}"></div>
          <div class="w-2.5 h-2.5 rounded-full border-2 border-slate-950 shadow-xl" style="background-color: ${color}"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const icons = {
  incident: createIcon('#f43f5e'), // Rose
  help: createIcon('#f59e0b'),     // Amber
  shelter: createIcon('#10b981'),  // Emerald
  hospital: createIcon('#38bdf8'), // Sky
  damage: createIcon('#f43f5e'),   // Rose
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Delhi

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, helpRes, sheltRes, weatherRes] = await Promise.all([
          api.get('/incidents'),
          api.get('/help-requests'),
          api.get('/shelters'),
          api.get('/weather/28.6139/77.2090')
        ]);
        setIncidents(incRes.data);
        setHelpRequests(helpRes.data);
        setShelters(sheltRes.data);
        setWeather(weatherRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on('new_incident', (incident: Incident) => setIncidents(prev => [incident, ...prev]));
    socket.on('new_help_request', (request: HelpRequest) => setHelpRequests(prev => [request, ...prev]));

    return () => {
      socket.off('new_incident');
      socket.off('new_help_request');
    };
  }, []);

  const totalAffected = useAnimatedCounter(incidents.reduce((sum, i) => sum + i.affected, 0));
  const totalRescued = useAnimatedCounter(incidents.reduce((sum, i) => sum + i.rescued, 0));

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-bg-primary font-sans">
        <div className="relative w-20 h-20 mb-10">
           <div className="absolute inset-0 rounded-full border-t-2 border-interactive animate-spin"></div>
           <div className="absolute inset-2 rounded-full border-b-2 border-interactive/20 animate-spin-slow"></div>
        </div>
        <p className="text-[12px] font-black text-text-muted uppercase tracking-[0.5em] animate-pulse">Initializing Tactical Matrix...</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[420px_1fr_360px] bg-bg-primary overflow-hidden font-sans">
      
      {/* Stream Column: Operational Intelligence */}
      <div className="border-r border-white/5 bg-bg-panel/40 flex flex-col overflow-hidden">
        <div className="p-10 border-b border-white/5 bg-white/2 backdrop-blur-md">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
               <Target className="w-6 h-6 text-interactive" />
            </div>
            <div>
               <h2 className="text-[24px] font-extrabold text-white tracking-tighter font-display leading-none mb-1.5 uppercase">Tactical <span className="text-interactive">Room</span></h2>
               <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">Global Sector Oversight</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="soft-card p-6 border-white/5 bg-white/5 hover:border-critical/40 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <ShieldAlert className="w-4 h-4 text-critical opacity-60" />
                <span className="text-[28px] font-mono font-bold text-white leading-none tracking-tighter">{incidents.length}</span>
              </div>
              <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">Active Breeches</p>
            </div>
            <div className="soft-card p-6 border-white/5 bg-white/5 hover:border-safe/40 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <Pulse className="w-4 h-4 text-safe opacity-60" />
                <span className="text-[28px] font-mono font-bold text-white leading-none tracking-tighter">{totalRescued}</span>
              </div>
              <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">Recovered Nodes</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Telemetry Feed</span>
            <div className="px-3 py-1 rounded-lg bg-safe/5 border border-safe/10 text-safe text-[10px] font-black tracking-widest flex items-center gap-2.5">
               <div className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_#10b981]" /> SYNC
            </div>
          </div>

          {incidents.map((incident, i) => (
            <div 
              key={incident.id} 
              className="soft-card p-6 group cursor-pointer animate-fade-slide-up border-white/5 hover:bg-white/5 hover:border-white/10"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => setMapCenter([incident.latitude, incident.longitude])}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[16px] font-extrabold text-white group-hover:text-interactive transition-colors tracking-tight leading-tight uppercase">{incident.title}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-[0.2em] ${
                   incident.severity === 'CRITICAL' ? 'border-critical/30 text-critical bg-critical/5' :
                   incident.severity === 'HIGH' ? 'border-warning/30 text-warning bg-warning/5' :
                   'border-interactive/30 text-interactive bg-interactive/5'
                }`}>{incident.severity}</span>
              </div>
              <p className="text-[14px] text-text-muted/70 mb-6 line-clamp-2 leading-relaxed font-medium">{incident.description}</p>
              <div className="flex items-center justify-between pt-5 border-t border-white/5">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-muted/30 uppercase tracking-[0.2em] mb-1.5">Impact</span>
                    <span className="text-[13px] font-mono font-bold text-white tracking-tighter">{incident.affected}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-muted/30 uppercase tracking-[0.2em] mb-1.5">Secured</span>
                    <span className="text-[13px] font-mono font-bold text-safe tracking-tighter">{incident.rescued}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/2 text-white/20">
                   <Clock className="w-3.5 h-3.5" />
                   <span className="text-[11px] font-mono font-bold tracking-tighter">{new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Column: Geospatial Visualization */}
      <div className="relative h-full flex flex-col bg-slate-950">
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inner_0_0_100px_rgba(0,0,0,0.4)]" />
        
        {/* Environmental Overlay */}
        <div className="absolute top-10 left-10 z-20 flex flex-col gap-6 max-w-[320px]">
          <div className="soft-card p-4 border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-3xl">
            <div className="flex flex-col gap-2">
              {[
                { id: 'inc', color: '#f43f5e', label: 'Incident Vector' },
                { id: 'help', color: '#f59e0b', label: 'Distress Signal' },
                { id: 'shel', color: '#10b981', label: 'Haven Anchor' }
              ].map(opt => (
                <button key={opt.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] border-2 border-slate-950" style={{ background: opt.color, color: opt.color }} />
                    <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.25em] group-hover:text-white transition-colors">{opt.label}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-interactive transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="soft-card px-8 py-5 flex items-center justify-between border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-3xl">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                   {weather?.description.includes('Cloud') ? <Droplets className="w-6 h-6 text-interactive" /> : <Thermometer className="w-6 h-6 text-warning" />}
                </div>
                <div>
                   <p className="text-[20px] font-mono font-bold text-white tracking-tighter leading-none">{weather?.temp}°C</p>
                   <p className="text-[10px] font-black text-text-muted/40 uppercase mt-1.5 tracking-widest">{weather?.description}</p>
                </div>
             </div>
             <div className="h-10 w-px bg-white/10 mx-6" />
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-3">
                   <Wind className="w-4 h-4 text-text-muted/40" />
                   <span className="text-[14px] font-mono font-bold text-white tracking-tighter">{weather?.wind} <span className="text-[10px] text-text-muted lowercase">km/h</span></span>
                </div>
                <span className="text-[9px] font-black text-text-muted/20 uppercase tracking-[0.2em] mt-1.5">Atmospheric Flux</span>
             </div>
          </div>
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          className="flex-1 w-full h-full"
          zoomControl={false}
          style={{ cursor: 'crosshair', filter: 'grayscale(0.2) contrast(1.1)' }}
        >
          <ChangeView center={mapCenter} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          
          {incidents.map(inc => (
            <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={icons.incident}>
              <Popup className="tactical-popup">
                <div className="p-4 min-w-[220px] bg-slate-900 text-white rounded-xl border border-white/10">
                  <h3 className="text-[16px] font-black text-critical mb-3 uppercase tracking-tight leading-none">{inc.title}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-400 mb-5 font-medium">{inc.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Node Alpha-1</span>
                    <span className="text-[10px] font-mono font-bold text-interactive px-2 py-1 rounded bg-interactive/10">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {helpRequests.map(help => (
            <Marker key={help.id} position={[help.latitude, help.longitude]} icon={icons.help}>
              <Popup>
                <div className="p-4 min-w-[220px] bg-slate-900 rounded-xl border border-white/10">
                  <h3 className="text-[16px] font-black text-warning mb-3 uppercase tracking-tight leading-none">Distress: {help.type}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-400 mb-5 font-medium">{help.description}</p>
                  <div className="flex items-center justify-center p-3 rounded-xl bg-warning/5 border border-warning/10 text-warning text-[10px] font-black tracking-[0.2em] uppercase">
                    Urgency: {help.urgency}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {shelters.map(shelt => (
            <Marker key={shelt.id} position={[shelt.latitude, shelt.longitude]} icon={icons.shelter}>
              <Popup>
                <div className="p-4 min-w-[220px] bg-slate-900 rounded-xl border border-white/10">
                  <h3 className="text-[16px] font-black text-safe mb-3 uppercase tracking-tight">{shelt.name}</h3>
                  <div className="mb-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-safe shadow-[0_0_15px_#10b981]" style={{ width: `${(shelt.occupancy/shelt.capacity)*100}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capacity Pulse</span>
                     <p className="text-[14px] font-mono text-white font-bold">{shelt.occupancy}<span className="text-slate-500 text-[11px]"> / {shelt.capacity}</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-10 right-10 z-20 soft-card p-6 border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-3xl">
          <div className="space-y-4">
            {[
              { color: '#f43f5e', label: 'Crisis Nodes' },
              { id: 'help', color: '#f59e0b', label: 'Priority SOS' },
              { id: 'shel', color: '#10b981', label: 'Secure Havens' },
              { id: 'hos', color: '#38bdf8', label: 'Med Facilities' }
            ].map(l => (
              <div key={l.label} className="flex items-center gap-5">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] border-2 border-slate-950" style={{ background: l.color, color: l.color }} />
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.25em]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Column: Emergency Broadcast Matrix */}
      <div className="border-l border-white/5 bg-bg-panel/40 flex flex-col overflow-hidden">
        <div className="p-10 border-b border-white/5 bg-white/2 backdrop-blur-md">
          <div className="flex items-center gap-5 mb-2">
            <Radio className="w-6 h-6 text-warning" />
            <h2 className="text-[24px] font-extrabold text-white tracking-tighter font-display leading-none uppercase">Sector <span className="text-warning">Broadcast</span></h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div className="flex items-center gap-4 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Live Matrix Signal</span>
          </div>

          {[
            { tag: 'HEALTH', title: 'Boil Water Protocol', text: 'Boil water for 300s due to grid filtration compromise in Sector 4.', time: '02:30', color: '#f59e0b' },
            { tag: 'EVACUATION', title: 'Mandatory Zero-Hour', text: 'West bank zones now under complete tactical evacuation order.', time: '02:15', color: '#f43f5e' },
            { tag: 'CLIMATE', title: 'Hydrological Warning', text: 'Precipitation surge expected to hit 65mm by 06:00 sector time.', time: '01:45', color: '#38bdf8' },
            { tag: 'LOGISTICS', title: 'Asset Hub Sync', text: 'Central Provision Grid relocated to East Corridor Alpha.', time: '01:10', color: '#10b981' }
          ].map((alert, i) => (
            <div key={i} className="soft-card p-6 border-l-2 bg-white/2 hover:bg-white/5 transition-all" style={{ borderColor: alert.color }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-[0.3em] px-2.5 py-1 rounded-lg bg-white/5" style={{ color: alert.color }}>{alert.tag}</span>
                <span className="text-[11px] font-mono text-white/20 uppercase font-black tracking-tighter">{alert.time}_SYNC</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-white mb-3 uppercase tracking-tight leading-tight">{alert.title}</h3>
              <p className="text-[13px] text-text-muted/60 leading-relaxed font-medium">{alert.text}</p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white/2 border-t border-white/5 backdrop-blur-xl">
          <h3 className="text-[10px] font-black text-text-muted/30 uppercase tracking-[0.3em] mb-6 pl-2">Neural Links</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-between px-6 py-5 rounded-[24px] bg-white/5 border border-white/10 hover:border-interactive hover:bg-interactive/5 transition-all group overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-1 bg-interactive transform -translate-x-full group-hover:translate-x-0 transition-transform" />
              <span className="text-[14px] font-extrabold text-white/80 group-hover:text-white uppercase tracking-[0.2em] relative z-10">Authorize SOS</span>
              <ShieldAlert className="w-5 h-5 text-white/20 group-hover:text-interactive group-hover:scale-110 transition-all relative z-10" />
            </button>
            <button className="flex items-center justify-between px-6 py-5 rounded-[24px] bg-white/5 border border-white/10 hover:border-interactive hover:bg-interactive/5 transition-all group overflow-hidden relative">
               <div className="absolute inset-y-0 left-0 w-1 bg-interactive transform -translate-x-full group-hover:translate-x-0 transition-transform" />
              <span className="text-[14px] font-extrabold text-white/80 group-hover:text-white uppercase tracking-[0.2em] relative z-10">Map Relay</span>
              <Compass className="w-5 h-5 text-white/20 group-hover:text-interactive group-hover:scale-110 transition-all relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
