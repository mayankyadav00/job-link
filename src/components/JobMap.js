'use client';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { X, Maximize2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

// Default center (Patna) if no jobs provided
const defaultCenter = {
  lat: 25.5941,
  lng: 85.1376
};

export default function JobMap({ jobs = [], isSingle = false }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY // We will add this to .env.local
  });

  const [map, setMap] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // For "Big Form" modal

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Calculate center based on jobs, or use default
  const center = jobs.length > 0 
    ? { lat: jobs[0].latitude || defaultCenter.lat, lng: jobs[0].longitude || defaultCenter.lng } 
    : defaultCenter;

  if (!isLoaded) return <div style={{height: '200px', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Map...</div>;

  // The Map Content (Reusable)
  const MapContent = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
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
      {/* SMALL MAP PREVIEW */}
      <div 
        style={{ position: 'relative', height: '250px', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        onClick={() => setIsOpen(true)}
        title="Click to expand map"
      >
        <MapContent />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <Maximize2 size={20} color="#333" />
        </div>
      </div>

      {/* BIG FORM MODAL (Full Screen) */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ width: '90%', height: '80%', background: 'white', borderRadius: '16px', position: 'relative', padding: '10px' }}>
            
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
            >
              <X size={24} />
            </button>

            <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden' }}>
              <MapContent />
            </div>
            
            {isSingle && jobs[0] && (
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', maxWidth: '300px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{jobs[0].title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{jobs[0].location_name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
