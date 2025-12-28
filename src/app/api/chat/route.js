// src/app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Direct REST API Call (Bypasses library version issues)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant for JobLink. Keep answers short. User said: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Check for Google API Errors
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Extract text
    const text = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ text });

  } catch (error) {
    console.error("Server AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
