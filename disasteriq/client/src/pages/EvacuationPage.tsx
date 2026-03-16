import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import { 
  Navigation, Zap, ShieldCheck, Map as MapIcon, 
  Clock, AlertTriangle, ArrowRight, Save, 
  Cpu, Radar, Compass, Activity, Wind, Satellite, Search, MapPin
} from 'lucide-react';

const createIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-6 h-6 rounded-full opacity-20 animate-ping" style="background-color: ${color}"></div>
          <div class="w-3 h-3 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const icons = {
  start: createIcon('#6366f1'), // Indigo 500
  end: createIcon('#10b981'),   // Emerald 500
  blocked: createIcon('#f43f5e') // Rose 500
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 500);
  }, [map]);
  return null;
}

const LOCATION_PRESETS: Record<string, [number, number]> = {
  'HYDERABAD': [17.3850, 78.4867],
  'TELANGANA': [17.3850, 78.4867],
  'DELHI': [28.6139, 77.2090],
  'MUMBAI': [19.0760, 72.8777],
  'MAHARASHTRA': [18.5204, 73.8567],
  'BANGALORE': [12.9716, 77.5946],
  'KARNATAKA': [12.9716, 77.5946],
  'CHENNAI': [13.0827, 80.2707],
  'TAMIL NADU': [13.0827, 80.2707],
  'KOLKATA': [22.5726, 88.3639],
  'WEST BENGAL': [22.5726, 88.3639]
};

export default function EvacuationPage() {
  const [loading, setLoading] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [routes, setRoutes] = useState<any[]>([]);
  const [targetState, setTargetState] = useState('');
  const [targetColony, setTargetColony] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysisActive(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const stateKey = targetState.toUpperCase().trim();
      const colonyKey = targetColony.toUpperCase().trim();
      const baseCoords = LOCATION_PRESETS[colonyKey] || LOCATION_PRESETS[stateKey] || [28.6139, 77.2090];
      
      const res = await api.post('/evacuation/generate-route', {
        start: baseCoords,
        end: [baseCoords[0] + 0.02, baseCoords[1] + 0.02],
        avoidZones: ['Sector-4-Flood'],
        state: targetState,
        colony: targetColony
      });
      setRoutes(res.data.routes);
      setSelectedRoute(res.data.routes[0]);
      setMapCenter(res.data.routes[0].path[0]);
      setMapZoom(13);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary font-sans overflow-hidden">
      {/* Header */}
      <div className="p-10 lg:p-12 border-b border-slate-200 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
           <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-500/10">
             <Navigation className="w-8 h-8 text-indigo-600" />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Smart Evacuation</h1>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Route Analysis Engine</span>
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
                    {targetColony && targetState ? `${targetColony} - ${targetState}` : 'National Overview'}
                  </span>
              </div>
           </div>
        </div>

        {!analysisActive ? (
          <button 
            disabled={!targetState || !targetColony}
            onClick={runAnalysis}
            className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
             Discover Safe Routes <Zap className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-4">
             <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Engine Latency</span>
                <span className="text-sm font-bold text-slate-900 tracking-tight">12.4ms Synchronized</span>
             </div>
             <button 
                onClick={() => { setAnalysisActive(false); setRoutes([]); }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm"
             >
                <RotateCcw className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[440px_1fr] overflow-hidden">
        {/* Left Control Panel */}
        <div className="border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          {!analysisActive ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-16 text-center">
               <div className="w-24 h-24 rounded-[40px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 shadow-sm">
                  <Radar className="w-10 h-10 text-slate-200 animate-pulse" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Plan Your Route</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium mb-12">
                  Enter your current state and colony to generate the safest evacuation routes based on real-time flood data and road integrity.
               </p>

               <div className="w-full space-y-4">
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <MapPin className="w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                     </div>
                     <input 
                        type="text"
                        value={targetState}
                        onChange={(e) => setTargetState(e.target.value)}
                        placeholder="Current State"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                     />
                  </div>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                     </div>
                     <input 
                        type="text"
                        value={targetColony}
                        onChange={(e) => setTargetColony(e.target.value)}
                        placeholder="Current Colony / Area"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                     />
                  </div>
                  
                  <button 
                    disabled={!targetState || !targetColony}
                    onClick={runAnalysis}
                    className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30 mt-6"
                  >
                    Start Smart Scan
                  </button>
               </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
               <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-50 rounded-full" />
                  <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin" />
                  <Cpu className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" />
               </div>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Analyzing Terrain Matrix...</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-slate-50/30">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Safe Recommendations</span>
                 <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-widest">{routes.length} SOLUTIONSFOUND</span>
              </div>

              {routes.map((route) => (
                <div 
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`bg-white p-6 cursor-pointer transition-all relative overflow-hidden rounded-[32px] border group ${
                    selectedRoute?.id === route.id ? 'border-indigo-500 shadow-xl shadow-indigo-500/5' : 'border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{route.name}</h3>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${route.safetyScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`} />
                        <span className={`text-xs font-bold ${route.safetyScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{route.safetyScore}% Safe</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-slate-50">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distance</span>
                        <span className="text-sm font-bold text-slate-900">{route.distance}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                        <span className="text-sm font-bold text-slate-900">{route.estimatedTime}</span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bypasses</span>
                        <span className="text-sm font-bold text-rose-500">{route.blockedRoadsAvoided} Blocks</span>
                     </div>
                  </div>

                  <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80 italic">
                     "{route.reasoning}"
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                     <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                        Send to Phone <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                     <div className="flex -space-x-2">
                        {[Satellite, Activity, Compass].map((Icon, i) => (
                           <div key={i} className="w-7 h-7 rounded-full bg-slate-50 border border-white flex items-center justify-center shadow-sm">
                              <Icon className="w-3 h-3 text-slate-300" />
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              ))}

              <div className="pt-6">
                 <div className="p-6 rounded-[28px] bg-rose-50 border border-rose-100 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                    <div>
                       <h4 className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-1">Local Constraint</h4>
                       <p className="text-xs text-rose-600 leading-relaxed font-medium">
                          Flood levels rising in north-east sectors. We recommend sticking to the AI-verified indigo path for maximum safety.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Map */}
        <div className="relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="h-full w-full"
            zoomControl={false}
          >
            <MapResizer />
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            {selectedRoute && (
              <>
                <Polyline 
                  positions={selectedRoute.path} 
                  color="#6366f1" 
                  weight={6} 
                  opacity={0.8}
                  dashArray="10, 10"
                />
                 <Marker position={selectedRoute.path[0]} icon={icons.start}>
                    <Popup className="premium-popup">
                       <div className="p-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest">Start Point</span>
                          <p className="text-xs font-bold mt-1 text-slate-900">{targetColony || 'Your Location'}</p>
                       </div>
                    </Popup>
                 </Marker>
                 <Marker position={selectedRoute.path[selectedRoute.path.length - 1]} icon={icons.end}>
                    <Popup className="premium-popup">
                       <div className="p-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Destination</span>
                          <p className="text-xs font-bold mt-1 text-slate-900">Safe Zone Hub</p>
                       </div>
                    </Popup>
                 </Marker>

                 <Marker position={[selectedRoute.path[1][0] + 0.002, selectedRoute.path[1][1] - 0.003]} icon={icons.blocked}>
                    <Popup className="premium-popup">
                       <div className="p-2">
                          <span className="text-[10px] uppercase font-bold text-rose-500 tracking-widest">Caution Area</span>
                          <p className="text-xs font-bold mt-1 text-slate-900">Road Blockage Reported</p>
                       </div>
                    </Popup>
                 </Marker>
              </>
            )}
          </MapContainer>

          {/* Map Overlays */}
          {analysisActive && (
            <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between">
               <div className="flex gap-3">
                  {[
                    { label: 'Heatmap', icon: Activity, color: 'text-rose-500' },
                    { label: 'Weather', icon: Wind, color: 'text-indigo-500' },
                    { label: 'Terrain', icon: MapIcon, color: 'text-emerald-500' }
                  ].map(layer => (
                    <button key={layer.label} className="px-5 py-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xl hover:bg-slate-50 transition-all">
                       <layer.icon className={`w-4 h-4 ${layer.color}`} />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{layer.label}</span>
                    </button>
                  ))}
               </div>

               <div className="bg-white border border-slate-200 px-8 py-4 rounded-[32px] flex items-center gap-10 shadow-xl">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Live Sync</span>
                     <div className="flex gap-1 h-3 items-end">
                        {[0.4, 0.7, 1, 0.6, 0.8, 0.3, 0.9].map((h, i) => (
                           <div key={i} className="w-1 bg-indigo-200 rounded-full" style={{ height: `${h * 100}%` }} />
                        ))}
                     </div>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Satellite Status</span>
                     <div className="flex items-center gap-2">
                        <Satellite className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 font-mono tracking-tight uppercase">Connected</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
