'use client';
import { useEffect, useRef } from 'react';

export default function JobMap({ jobs }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. Safety Check: Do we have an API Key?
    if (!window.google) return;

    // 2. Create Map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 25.5941, lng: 85.1376 }, // Default to Patna
      zoom: 12,
    });

    // 3. Add Pins (ONLY for valid jobs)
    jobs.forEach((job) => {
      // CRASH FIX: Check if lat/lng exist and are numbers
      if (job.latitude && job.longitude && !isNaN(job.latitude)) {
        
        const marker = new window.google.maps.Marker({
          position: { lat: job.latitude, lng: job.longitude },
          map: map,
          title: job.title,
        });

        // Add Click Info Window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color:black"><b>${job.title}</b><br>₹${job.pay_rate}</div>`
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    });
  }, [jobs]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '15px' }} />;
}
