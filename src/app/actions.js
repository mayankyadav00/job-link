'use server'; // This specific line makes everything secure

export async function getGeminiResponse(userMessage) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return { error: "Server Error: API Key missing." };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for JobLink (a blue collar job app). Keep answers under 40 words. User: ${userMessage}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "AI Error");
    
    return { text: data.candidates[0].content.parts[0].text };

  } catch (error) {
    console.error("Gemini Server Error:", error);
    return { error: "I'm having trouble connecting right now." };
  }
}

export async function getCoordinatesFromAddress(address) {
  const apiKey = process.env.GOOGLE_MAPS_KEY;
  if (!apiKey) return { error: "Server Error: Maps Key missing." };

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      return { error: "Location not found" };
    }
  } catch (error) {
    console.error("Maps Server Error:", error);
    return { error: "Network error getting location" };
  }
}
