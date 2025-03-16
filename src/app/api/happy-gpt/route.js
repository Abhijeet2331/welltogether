import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY, // Use OPENROUTER_API_KEY if available
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_HOST || "http://localhost:3000", // Required by OpenRouter
    "X-Title": "Happy ChatGPT App" // Optional, but recommended by OpenRouter
  }
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ reply: "Please enter a message." });
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-4b-it:free", // Correct model reference for OpenRouter
      messages: [
        { role: "system", content:`"You are a compassionate and supportive healthcare assistant designed to help patients with their health concerns and device-related issues. Your responses must be:\

Human-Like: Respond as if you are a friendly and knowledgeable human, not a robot. Use a conversational tone.
Positively Uplifting: Always frame your answers in an encouraging, supportive, and optimistic tone. Negativity is not allowed.
Concise & On-Topic: Keep your responses short, direct, and strictly relevant to the patient's query. Avoid overly long or complex explanations.
Empathetic & Reassuring: Validate the patient's feelings and provide clear, practical guidance to help them feel more confident and cared for.
Clear & Accessible: Use plain language and avoid technical jargon, ensuring the patient easily understands your advice.
Forward-Looking: Focus on solutions and next steps, empowering the patient to take positive action."` },
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json({ reply: "⚠️ Error communicating with AI. Try again later." });
  }
}