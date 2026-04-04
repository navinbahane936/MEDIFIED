import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AlertBanner from './components/AlertBanner';
import StatsDashboard from './components/StatsDashboard';
import SearchFilters from './components/SearchFilters';
import HospitalCard from './components/HospitalCard';
import MapSection from './components/MapSection';
import BookingModal from './components/BookingModal';
import EmergencyView from './components/EmergencyView';
import HospitalPortal from './components/HospitalPortal';
import AIChatbot from './components/AIChatbot';
import { HospitalWithBeds, supabase } from './lib/supabase';
import { NANDED_HOSPITALS } from './data/mockHospitals';

function App() {
  const [activeTab, setActiveTab] = useState<'find' | 'emergency' | 'portal'>('find');
  const [hospitals, setHospitals] = useState<HospitalWithBeds[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<HospitalWithBeds[]>([]);
  const [selectedBedType, setSelectedBedType] = useState('All Beds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithBeds | null>(null);
  const [loading, setLoading] = useState(true);
  const [criticalAlert, setCriticalAlert] = useState<string | null>(null);
  const [chatbotRecommendedBeds, setChatbotRecommendedBeds] = useState<string[] | null>(null);

  useEffect(() => {
    fetchHospitals();
    const interval = setInterval(simulateRealTimeUpdate, 30000);
    return () => clearInterval(interval);
  }, []);

  const filterHospitals = useCallback(() => {
    let filtered = [...hospitals];

    // Apply chatbot recommendation filter first (if active)
    if (chatbotRecommendedBeds && chatbotRecommendedBeds.length > 0) {
      filtered = filtered.filter((hospital) =>
        hospital.bed_availability.some(
          (bed) => chatbotRecommendedBeds.includes(bed.bed_type) && bed.available_beds > 0
        )
      );
    } else if (selectedBedType !== 'All Beds') {
      // Apply manual bed type filter if no chatbot recommendation
      filtered = filtered.filter((hospital) =>
        hospital.bed_availability.some(
          (bed) => bed.bed_type === selectedBedType && bed.available_beds > 0
        )
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredHospitals(filtered);
  }, [hospitals, selectedBedType, searchQuery, chatbotRecommendedBeds]);

  const checkCriticalAlerts = useCallback(() => {
    const criticalHospital = hospitals.find((hospital) =>
      hospital.bed_availability.some(
        (bed) => bed.bed_type === 'ICU' && bed.available_beds <= 2 && bed.available_beds > 0
      )
    );

    if (criticalHospital) {
      const icuBed = criticalHospital.bed_availability.find((bed) => bed.bed_type === 'ICU');
      setCriticalAlert(
        `${criticalHospital.name} ICU almost full - only ${icuBed?.available_beds} beds left. Book now.`
      );
    }
  }, [hospitals]);

  useEffect(() => {
    filterHospitals();
  }, [filterHospitals]);

  useEffect(() => {
    checkCriticalAlerts();
  }, [checkCriticalAlerts]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select(`
          *,
          bed_availability (*)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setHospitals(data as HospitalWithBeds[]);
      } else {
        // Fallback to mock data if database is empty 
        setHospitals(NANDED_HOSPITALS);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setHospitals(NANDED_HOSPITALS);
    } finally {
      setLoading(false);
    }
  };

  const simulateRealTimeUpdate = async () => {
    // Simulate real-time updates with mock data
    setHospitals(prev =>
      prev.map(hospital => ({
        ...hospital,
        bed_availability: hospital.bed_availability.map(bed => ({
          ...bed,
          last_updated: new Date().toISOString(),
        })),
      }))
    );
  };

  const handleUpdateBed = async (hospitalId: string, bedType: string, newAvailable: number) => {
    // 1. Instantly update the UI so it feels extremely fast
    let targetBedId: string | undefined;
    
    setHospitals(prev => prev.map(hospital => {
      if (hospital.id === hospitalId) {
        return {
          ...hospital,
          bed_availability: hospital.bed_availability.map(bed => {
            if (bed.bed_type === bedType) {
              targetBedId = bed.id;
              const status = newAvailable <= 2 ? 'CRITICAL' : (newAvailable <= 5 ? 'MODERATE' : 'AVAILABLE');
              return {
                ...bed,
                available_beds: newAvailable,
                status: status as 'AVAILABLE' | 'MODERATE' | 'CRITICAL',
                last_updated: new Date().toISOString()
              };
            }
            return bed;
          })
        };
      }
      return hospital;
    }));

    // 2. Perform the actual Supabase database row update
    if (targetBedId) {
      try {
        const status = newAvailable <= 2 ? 'CRITICAL' : (newAvailable <= 5 ? 'MODERATE' : 'AVAILABLE');
        await supabase
          .from('bed_availability')
          .update({ 
            available_beds: newAvailable, 
            status: status,
            last_updated: new Date().toISOString()
          })
          .eq('id', targetBedId);
      } catch (error) {
        console.error("Error pushing update to Supabase", error);
      }
    }
  };



  const calculateStats = () => {
    const icuBeds = hospitals.reduce(
      (sum, h) => sum + (h.bed_availability.find((b) => b.bed_type === 'ICU')?.available_beds || 0),
      0
    );
    const ventilators = hospitals.reduce(
      (sum, h) => sum + (h.bed_availability.find((b) => b.bed_type === 'Ventilator')?.available_beds || 0),
      0
    );
    const oxygenBeds = hospitals.reduce(
      (sum, h) => sum + (h.bed_availability.find((b) => b.bed_type === 'Oxygen')?.available_beds || 0),
      0
    );
    const hospitalsOnline = hospitals.filter((h) => h.is_online).length;

    return { icuBeds, ventilators, oxygenBeds, hospitalsOnline };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading hospital data...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  const handleChatbotRecommendation = (recommendedBeds: string[]) => {
    setChatbotRecommendedBeds(recommendedBeds);
  };

  const clearChatbotRecommendation = () => {
    setChatbotRecommendedBeds(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {activeTab === 'find' && (
          <>
            {criticalAlert && <AlertBanner message={criticalAlert} severity="critical" />}

            {chatbotRecommendedBeds && (
              <AlertBanner
                message={`📋 Showing hospitals with recommended bed type: ${chatbotRecommendedBeds.join(', ')}. Click here to clear filter.`}
                severity="informational"
                onDismiss={clearChatbotRecommendation}
              />
            )}

            <StatsDashboard stats={stats} />

            <SearchFilters
              selectedBedType={selectedBedType}
              onBedTypeChange={setSelectedBedType}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={filterHospitals}
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Available Hospitals ({filteredHospitals.length})
                  </h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Sort by distance
                  </button>
                </div>

                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <HospitalCard
                      key={hospital.id}
                      hospital={hospital}
                      onBookNow={setSelectedHospital}
                    />
                  ))
                ) : (
                  <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
                    <p className="text-slate-400 text-lg">No hospitals found matching your criteria</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <MapSection />
              </div>
            </div>
          </>
        )}

        {activeTab === 'emergency' && (
          <EmergencyView hospitals={hospitals} onBookNow={setSelectedHospital} />
        )}

        {activeTab === 'portal' && (
          <HospitalPortal 
            hospitals={hospitals} 
            onUpdateBed={handleUpdateBed} 
          />
        )}
      </main>

      {selectedHospital && (
        <BookingModal hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />
      )}

      {/* AI Medical Triage Chatbot */}
      <AIChatbot onRecommendationChange={handleChatbotRecommendation} />
    </div>
  );
}

export default App;
