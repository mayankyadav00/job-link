'use client';
import { useEffect, useRef } from 'react';

export default function JobMap({ jobs }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. Wait for Google Script to load
    if (!window.google || !window.google.maps) return;

    // 2. Default Center (Patna)
    const defaultCenter = { lat: 25.5941, lng: 85.1376 };
    
    // If we have jobs, center on the first one
    const center = (jobs.length > 0 && jobs[0].latitude)
      ? { lat: jobs[0].latitude, lng: jobs[0].longitude }
      : defaultCenter;

    // 3. Create Map
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: jobs.length === 1 ? 15 : 12, // Zoom in closer if it's a single job
      disableDefaultUI: true, // Cleaner look for mobile
    });

    // 4. Add Pins
    jobs.forEach((job) => {
      if (job.latitude && job.longitude) {
        
        const marker = new window.google.maps.Marker({
          position: { lat: job.latitude, lng: job.longitude },
          map: map,
          title: job.title,
        });

        // Info Window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color:black; padding:5px;">
              <b style="font-size:14px">${job.title}</b><br>
              <span style="color:#555">₹${job.pay_rate}</span>
            </div>`
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    });

  }, [jobs]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '15px' }} />;
}
