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

// Premium light-themed markers
const createIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-5 h-5 rounded-full opacity-10 animate-ping" style="background-color: ${color}"></div>
          <div class="w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const icons = {
  incident: createIcon('#ef4444'), // Red
  help: createIcon('#f59e0b'),     // Amber
  shelter: createIcon('#10b981'),  // Emerald
  hospital: createIcon('#0ea5e9'), // Sky
  damage: createIcon('#ef4444'),   // Red
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India Center
  const [mapZoom, setMapZoom] = useState(5);
  const [meshStatus, setMeshStatus] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, helpRes, sheltRes, weatherRes, meshRes] = await Promise.all([
          api.get('/incidents'),
          api.get('/help-requests'),
          api.get('/shelters'),
          api.get('/weather/28.6139/77.2090'),
          api.get('/mesh/mesh-status')
        ]);
        setIncidents(incRes.data);
        setHelpRequests(helpRes.data);
        setShelters(sheltRes.data);
        setWeather(weatherRes.data);
        setMeshStatus(meshRes.data);
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

  const totalRescued = useAnimatedCounter(incidents.reduce((sum, i) => sum + i.rescued, 0));

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-bg-primary">
        <div className="relative w-16 h-16 mb-6">
           <div className="absolute inset-0 rounded-full border-2 border-indigo-100"></div>
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
        </div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading Environment...</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[380px_1fr_340px] bg-bg-primary overflow-hidden">
      
      {/* Column 1: Incident Feed */}
      <div className="bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
               <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">Safety Overview</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real-time incident monitoring</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 opacity-70" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{incidents.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Pulse className="w-3.5 h-3.5 text-emerald-500 opacity-70" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secured</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{totalRescued}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/30">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Recent Incidents</p>
          {incidents.map((incident, i) => (
            <div 
              key={incident.id} 
              className="p-5 rounded-2xl bg-white border border-slate-200 group cursor-pointer hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all animate-fade-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => {
                setMapCenter([incident.latitude, incident.longitude]);
                setMapZoom(13);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{incident.title}</h3>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-wider ${
                   incident.severity === 'CRITICAL' ? 'border-rose-100 text-rose-600 bg-rose-50' :
                   incident.severity === 'HIGH' ? 'border-amber-100 text-amber-600 bg-amber-50' :
                   'border-emerald-100 text-emerald-600 bg-emerald-50'
                }`}>{incident.severity}</span>
              </div>
              <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{incident.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Affected</span>
                    <span className="text-[12px] font-bold text-slate-700">{incident.affected}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rescued</span>
                    <span className="text-[12px] font-bold text-emerald-600">{incident.rescued}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                   <Clock className="w-3 h-3" />
                   <span className="text-[11px] font-semibold">{new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Map Visualization */}
      <div className="relative h-full flex flex-col bg-slate-100">
        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4 max-w-[280px]">
          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-900/5">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <Radio className="w-3.5 h-3.5 text-indigo-600" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Network Status</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             </div>
             <div className="flex items-end justify-between">
                <div>
                   <p className="text-xl font-bold text-slate-900">{meshStatus?.nearbyNodes || 12}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Nearby Nodes</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-bold text-indigo-600">{meshStatus?.activeNodes || 142}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Fleet</p>
                </div>
             </div>
          </div>
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          className="flex-1 w-full h-full"
          zoomControl={false}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          
          {incidents.map(inc => (
            <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={icons.incident}>
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">{inc.title}</h3>
                  <p className="text-[12px] leading-relaxed text-slate-500 mb-3">{inc.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Zone {inc.id.slice(0, 4)}</span>
                    <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 uppercase">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {helpRequests.map(help => (
            <Marker key={help.id} position={[help.latitude, help.longitude]} icon={icons.help}>
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <h3 className="text-[15px] font-bold text-amber-600 mb-1">Request: {help.type}</h3>
                  <p className="text-[12px] leading-relaxed text-slate-500 mb-3">{help.description}</p>
                  <div className="w-full text-center p-2 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                    Urgency: {help.urgency}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {shelters.map(shelt => (
            <Marker key={shelt.id} position={[shelt.latitude, shelt.longitude]} icon={icons.shelter}>
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-2">{shelt.name}</h3>
                  <div className="mb-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(shelt.occupancy/shelt.capacity)*100}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Occupancy</span>
                     <p className="text-[13px] font-bold text-slate-700">{shelt.occupancy}<span className="text-slate-400 text-[11px]"> / {shelt.capacity}</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Column 3: Regional Overview & Priorities */}
      <div className="bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Radio className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 leading-none">Emergency Broadcast</h2>
          </div>
          
          <div className="space-y-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Critical Priorities</p>
             {[
                { id: 'A', name: 'Sector 4 North', status: 'Priority', pop: 1200, water: '+2.1m', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { id: 'B', name: 'West Corridor', status: 'Critical', pop: 850, water: '+3.4m', color: 'bg-rose-50 text-rose-600 border-rose-100' }
             ].map(zone => (
                <div key={zone.id} className={`p-5 rounded-2xl border ${zone.color} transition-all shadow-sm`}>
                   <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[12px] font-bold uppercase tracking-wider">Zone {zone.id}</h4>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg border border-current opacity-70">{zone.status}</span>
                   </div>
                   <p className="text-[14px] font-bold mb-4">{zone.name}</p>
                   <div className="grid grid-cols-2 gap-4 border-t border-current/10 pt-4">
                      <div>
                         <p className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Population</p>
                         <p className="text-[14px] font-bold tabular-nums">{zone.pop}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Water Level</p>
                         <p className="text-[14px] font-bold tabular-nums">{zone.water}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Signals</span>
          </div>

          {[
            { tag: 'HEALTH', title: 'Boil Water Protocol', text: 'Boil water for 5 minutes due to filtration compromise.', time: '02:30 AM', color: '#f59e0b' },
            { tag: 'SECURITY', title: 'Route Clearance', text: 'Main highway cleared for emergency transport only.', time: '02:15 AM', color: '#6366f1' }
          ].map((alert, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-lg border bg-white" style={{ borderColor: `${alert.color}30`, color: alert.color }}>{alert.tag}</span>
                <span className="text-[10px] font-bold text-slate-300">{alert.time}</span>
              </div>
              <h3 className="text-[14px] font-bold text-slate-800 mb-2 leading-tight">{alert.title}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">{alert.text}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-600/20 transition-all active:scale-95 group">
              <ShieldAlert className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-wider">Emergency SOS</span>
            </button>
        </div>
      </div>
    </div>
  );
}
