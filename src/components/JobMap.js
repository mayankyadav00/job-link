'use client';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { X, Maximize2, MapPinOff } from 'lucide-react'; // Added MapPinOff icon

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

// Default center (Patna)
const defaultCenter = {
  lat: 25.5941,
  lng: 85.1376
};

export default function JobMap({ jobs = [], isSingle = false }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  
  // 1. SAFEGUARD: If no API Key, show "Mock Map" Placeholder
  if (!apiKey) {
    return (
      <div style={{ 
        width: '100%', height: '100%', minHeight: '250px', 
        background: '#e2e8f0', borderRadius: '12px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        color: '#64748b', textAlign: 'center', padding: '20px',
        border: '2px dashed #cbd5e1'
      }}>
        <MapPinOff size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>Map Unavailable</h3>
        <p style={{ fontSize: '0.8rem', margin: '5px 0 0 0' }}>Google Maps API Key is missing.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '10px', background: '#fff', padding: '5px 10px', borderRadius: '4px' }}>
          Displaying static location: <strong>{jobs[0]?.location_name || 'Patna'}</strong>
        </p>
      </div>
    );
  }

  // 2. If API Key exists, try to load the Real Map
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [map, setMap] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const center = jobs.length > 0 && jobs[0].latitude
    ? { lat: jobs[0].latitude, lng: jobs[0].longitude } 
    : defaultCenter;

  // Handle Load Error gracefully
  if (loadError) {
    return <div style={{ padding: '20px', textAlign: 'center', background: '#fee2e2', color: '#dc2626', borderRadius: '12px' }}>Map failed to load. Check API Key restrictions.</div>;
  }

  if (!isLoaded) return <div style={{height: '100%', minHeight: '250px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Map...</div>;

  // Render Real Map
  const MapContent = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {jobs.map((job) => (
         job.latitude && job.longitude && (
          <Marker
            key={job.id}
            position={{ lat: job.latitude, lng: job.longitude }}
            title={job.title}
          />
         )
      ))}
    </GoogleMap>
  );

  return (
    <>
      <div 
        style={{ position: 'relative', height: '100%', minHeight: '250px', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        onClick={() => setIsOpen(true)}
      >
        <MapContent />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <Maximize2 size={20} color="#333" />
        </div>
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ width: '90%', height: '80%', background: 'white', borderRadius: '16px', position: 'relative', padding: '10px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
            >
              <X size={24} />
            </button>
            <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden' }}>
              <MapContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
