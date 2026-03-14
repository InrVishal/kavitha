import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Shelter } from '../types';
import { 
  Building2, MapPin, Users, Phone, 
  Search, Filter, Navigation, Loader2,
  Waves, Heart, Thermometer, ShieldCheck,
  Zap, Droplets, Utensils, Wifi, Bed, CheckCircle2,
  Compass, Shield, Target, Cpu
} from 'lucide-react';

const amenityIcons = {
  'Water': Droplets,
  'Food': Utensils,
  'Medical': Heart,
  'Bedding': Bed,
  'WiFi': Wifi,
  'Electricity': Zap,
  'Safe Space': Shield
};

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shelters', { params: { type: typeFilter } });
      setShelters(res.data);
    } catch (err) {
      console.error('Failed to fetch shelters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [typeFilter]);

  const filtered = shelters.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12 lg:p-16 max-w-7xl mx-auto font-sans min-h-screen">
      {/* Precision Haven Header */}
      <div className="bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 mb-16 shadow-2xl relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-safe/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 rounded-[30px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
              <Building2 className="w-10 h-10 text-interactive group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white font-display tracking-tighter leading-none mb-4 uppercase">Sanctuary <span className="text-gradient-emerald">Network</span></h1>
              <p className="text-[16px] text-text-muted font-medium tracking-tight opacity-70">Authenticated high-integrity survival hubs and real-time capacity monitoring.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/2 p-2 rounded-[32px] border border-white/5 backdrop-blur-xl no-scrollbar overflow-x-auto shadow-inner">
            {['all', 'shelter', 'hospital', 'food'].map(type => (
              <button 
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-10 py-3.5 rounded-[22px] text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                   typeFilter === type ? 'bg-interactive text-bg-primary shadow-2xl shadow-interactive/20' : 'text-text-muted/40 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
        {/* Intelligence Feed */}
        <div className="space-y-14">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/20 group-focus-within:text-interactive transition-colors" />
            <input 
              type="text"
              placeholder="COORD_SCAN: NAME, ADDR, OR SECTOR_INDEX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/2 border border-white/5 rounded-[40px] pl-20 pr-10 py-7 text-[16px] text-white focus:outline-none focus:border-interactive transition-all shadow-inner font-mono tracking-tighter uppercase placeholder:text-white/5"
            />
          </div>

          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center animate-pulse">
              <div className="relative w-20 h-20 mb-10">
                 <Loader2 className="w-20 h-20 text-safe animate-spin opacity-20" />
                 <div className="absolute inset-0 border-t-2 border-safe rounded-full animate-spin-slow" />
              </div>
              <span className="text-[12px] font-black text-text-muted/40 uppercase tracking-[0.5em]">Calibrating Vector Entrances...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filtered.map((shelter, i) => (
                <div 
                  key={shelter.id} 
                  className="soft-card group animate-fade-slide-up bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/3 transition-all overflow-hidden rounded-[40px]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="p-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-inner ${
                          shelter.type === 'hospital' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 
                          shelter.type === 'food' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {shelter.type}
                        </span>
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                           <div className="w-1.5 h-1.5 rounded-full bg-safe shadow-[0_0_12px_#10b981] animate-pulse" />
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Integrity Verified</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-white/10 font-black uppercase tracking-widest">{shelter.region}</span>
                    </div>

                    <h3 className="text-[22px] font-black text-white mb-3 group-hover:text-interactive transition-colors uppercase tracking-tight leading-none">{shelter.name}</h3>
                    <div className="flex items-start gap-4 mb-10">
                      <MapPin className="w-4 h-4 text-interactive/40 shrink-0 mt-1" />
                      <p className="text-[14px] text-text-muted leading-relaxed font-medium opacity-70 italic">{shelter.address}</p>
                    </div>

                    <div className="space-y-6 mb-12">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.35em] text-white/20 mb-3 ml-2">
                        <span>Tactical Load Offset</span>
                        <span className="text-white font-mono tracking-tighter font-bold text-[14px]">{Math.round((shelter.occupancy / shelter.capacity) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div 
                          className={`h-full transition-all duration-1000 shadow-[0_0_15px_currentColor] rounded-full ${
                             (shelter.occupancy / shelter.capacity) > 0.9 ? 'text-critical' : 
                             (shelter.occupancy / shelter.capacity) > 0.7 ? 'text-warning' : 'text-safe'
                          }`}
                          style={{ width: `${(shelter.occupancy / shelter.capacity) * 100}%`, backgroundColor: 'currentColor' }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white/10 tracking-widest uppercase px-2">
                        <span>{shelter.occupancy} ACTIVE_UNITS</span>
                        <span>{shelter.capacity} CAPACITY_LIMIT</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-12 min-h-[60px] content-start">
                      {shelter.amenities.map(item => {
                        const Icon = (amenityIcons as any)[item] || CheckCircle2;
                        return (
                          <div key={item} className="flex items-center gap-3 px-4 py-2 bg-white/2 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-default">
                            <Icon className="w-4 h-4 text-interactive/60" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{item}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      className="w-full py-5 rounded-[24px] bg-white/2 border border-white/5 font-black text-[13px] uppercase tracking-[0.4em] text-white/70 hover:bg-white/5 hover:border-interactive hover:text-white transition-all duration-500 flex items-center justify-center gap-6 group overflow-hidden relative"
                      onClick={() => window.open(`http://maps.google.com/?q=${shelter.latitude},${shelter.longitude}`, '_blank')}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-interactive transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                      <Navigation className="w-5 h-5 text-text-muted/40 group-hover:text-interactive group-hover:scale-110 transition-all relative z-10" /> 
                      <span className="relative z-10">Uplink Vector</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tactical Advisory Matrix */}
        <div className="hidden lg:block space-y-10">
          <div className="soft-card glass-panel bg-white/1 p-12 sticky top-40 border-white/5 shadow-2xl rounded-[48px]">
            <div className="flex items-center gap-6 mb-12">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-interactive" />
               </div>
               <div>
                  <h3 className="text-[20px] font-black text-white uppercase tracking-tighter leading-none mb-2">Sector Command</h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Operational Advisory Protocols</p>
               </div>
            </div>
            
            <div className="space-y-12">
              {[
                { icon: Heart, label: 'Asset Unity', text: 'Maintain strict group cohesion during transit. All units must broadcast identity signatures to intake officers.' },
                { icon: ShieldCheck, label: 'Double Verification', text: 'Sanctuary integrity is verified by triple-redundancy relay nodes. False beacons are immediately purged.' },
                { icon: Thermometer, label: 'Clinical Uplink', text: 'Bio-support suites are prioritized at hospital hubs marked as OMEGA-CLASS. Maintain medical clearance.' },
                { icon: Navigation, label: 'Vector Correction', text: 'Routing telemetry synchronizes every 300s. Deviate only if primary vectors reach critical obstruction.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/2 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/5 transition-all duration-500">
                    <item.icon className="w-6 h-6 text-interactive/40 group-hover:text-interactive group-hover:scale-110 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-white uppercase tracking-[0.2em] mb-3 group-hover:text-interactive transition-colors">{item.label}</h4>
                    <p className="text-[14px] text-text-muted/60 leading-relaxed font-medium group-hover:text-white/80 transition-colors uppercase tracking-tight italic">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-10 rounded-[40px] bg-white/2 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-2 h-full bg-interactive opacity-20 group-hover:opacity-100 transition-opacity" />
               <p className="text-[16px] font-black text-white uppercase tracking-tight mb-6 leading-relaxed relative z-10 italic">
                  "WE MONITOR THE GRID. YOU SECURE THE HAVEN. RESILIENCE IS THE MISSION."
               </p>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-interactive animate-pulse shadow-[0_0_10px_currentColor]" />
                  <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Central Command // Auth: 41-A</span>
               </div>
               <div className="absolute bottom-0 right-0 p-8 opacity-5">
                  <Cpu className="w-20 h-20 text-interactive" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
