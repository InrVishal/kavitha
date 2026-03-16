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
    <div className="p-8 lg:p-12 max-w-7xl mx-auto font-sans min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-12 mb-12 shadow-xl shadow-slate-900/5 relative overflow-hidden animate-fade-slide-up">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-1" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Safety Shelters</h1>
              <p className="text-slate-500 font-medium tracking-tight">Verified emergency housing and medical facilities with real-time capacity.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[28px] border border-slate-100 no-scrollbar overflow-x-auto">
            {['all', 'shelter', 'hospital', 'food'].map(type => (
              <button 
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-8 py-3 rounded-[22px] text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                   typeFilter === type ? 'bg-white text-indigo-600 shadow-lg shadow-slate-900/5 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Main Feed */}
        <div className="space-y-10">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, address, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[32px] pl-20 pr-10 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-8">
                 <Loader2 className="w-16 h-16 text-indigo-50 animate-spin" />
                 <div className="absolute inset-0 border-t-2 border-indigo-600 rounded-full animate-spin" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Locating nearby shelters...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((shelter, i) => (
                <div 
                  key={shelter.id} 
                  className="bg-white group animate-fade-slide-up border border-slate-200 hover:border-indigo-100 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-[40px]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="p-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                          shelter.type === 'hospital' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                          shelter.type === 'food' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {shelter.type}
                        </span>
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{shelter.region}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{shelter.name}</h3>
                    <div className="flex items-start gap-3 mb-8">
                      <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{shelter.address}</p>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupancy Status</span>
                        <span className="text-sm font-bold text-slate-900">{Math.round((shelter.occupancy / shelter.capacity) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className={`h-full transition-all duration-1000 rounded-full ${
                             (shelter.occupancy / shelter.capacity) > 0.9 ? 'bg-rose-500' : 
                             (shelter.occupancy / shelter.capacity) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(shelter.occupancy / shelter.capacity) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        <span>{shelter.occupancy} Taken</span>
                        <span>{shelter.capacity} Total Beds</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10 min-h-[50px] content-start">
                      {shelter.amenities.map(item => {
                        const Icon = (amenityIcons as any)[item] || CheckCircle2;
                        return (
                          <div key={item} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all cursor-default">
                            <Icon className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      className="w-full py-4 rounded-2xl bg-indigo-50 border border-indigo-100 font-bold text-xs uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-4 group"
                      onClick={() => window.open(`http://maps.google.com/?q=${shelter.latitude},${shelter.longitude}`, '_blank')}
                    >
                      <Navigation className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /> 
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info & Safety Section */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 p-10 lg:p-12 sticky top-32 shadow-xl shadow-slate-900/5 rounded-[48px] overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
               <Shield className="w-40 h-40 text-indigo-600" />
            </div>
            
            <div className="flex items-center gap-6 mb-10 relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <Heart className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Safety Tips</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival Protocols</p>
               </div>
            </div>
            
            <div className="space-y-10 relative z-10">
              {[
                { icon: Users, label: 'Stay Together', text: 'Keep your group cohesive. Inform shelter staff of all family members upon arrival.' },
                { icon: ShieldCheck, label: 'Verified Locations', text: 'Only go to verified shelters listed here or shared by official government channels.' },
                { icon: Thermometer, label: 'Medical Care', text: 'If you have medical needs, prioritize hospital-type shelters marked in blue.' },
                { icon: MapPin, label: 'Route Safety', text: 'Always check local route safety before traveling to a shelter during a flood.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 transition-all">
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-[32px] bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
               <p className="text-[15px] font-bold tracking-tight mb-4 leading-relaxed relative z-10 italic">
                  "Your safety is our priority. Please help us maintain a supportive environment at all shelter locations."
               </p>
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Safety Coordination Team</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
