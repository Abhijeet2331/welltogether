import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Reads from .env.local
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ reply: "Please enter a message." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a happy, optimistic assistant that always gives hopeful answers." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ reply: "⚠️ Error communicating with AI. Try again later." });
  }
}
