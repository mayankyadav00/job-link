// src/app/api/chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Get the message from the frontend
    const { message } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing on server" }, { status: 500 });
    }

    // 2. Initialize Gemini (Server-side)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use the standard model. If 'flash' fails, try 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Create a simple context
    const prompt = `
      You are a helpful customer support AI for an app called "JobLink" in Patna, India.
      JobLink connects daily wage workers (Seekers) with Job Providers.
      - If asked about jobs, tell them to go to the "Search" tab.
      - If asked about hiring, tell them to use the "Provider Dashboard".
      - Keep answers short, friendly, and use simple English.
      
      User said: ${message}
    `;

    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send text back to frontend
    return NextResponse.json({ text });

  } catch (error) {
    console.error("Server AI Error:", error);
    return NextResponse.json({ 
      error: "Failed to process AI request", 
      details: error.message 
    }, { status: 500 });
  }
}
