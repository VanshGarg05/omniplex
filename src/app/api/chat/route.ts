import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Initialize OpenAI with fallback
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('Failed to initialize OpenAI client for chat:', error);
}

export const runtime = "edge";

export async function POST(req: Request) {
  // Check if OpenAI client is available
  if (!openai) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const {
      messages,
      model,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
    } = await req.json();

    const response = await openai.chat.completions.create({
      stream: true,
      model: model,
      temperature: temperature,
      max_tokens: max_tokens,
      top_p: top_p,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
      messages: messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle specific OpenAI errors
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return new Response(
        JSON.stringify({ error: "OpenAI quota exceeded or rate limited" }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
