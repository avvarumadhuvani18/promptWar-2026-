import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/ai/gemini";

export async function GET() {
  const configured = isGeminiConfigured();
  return NextResponse.json({
    geminiConfigured: configured,
    activeMode: configured ? "LIVE_AI_ACTIVE" : "DEMO_MODE_ACTIVE",
    model: "gemini-1.5-flash",
    message: configured
      ? "Gemini AI is configured and ready for live multimodal document extraction."
      : "Gemini API key not detected. Application running in transparent DEMO MODE with predefined synthetic datasets.",
  });
}
