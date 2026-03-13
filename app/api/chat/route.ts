import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    if (image) {
      console.log(`Received image payload size: ${(image.length / 1024).toFixed(2)} KB`);
    }

    if (!process.env.GROQ_API_KEY) {
       console.warn("Groq API Key missing.");
       return NextResponse.json({ 
         reply: "API key is missing! Please configure the GROQ_API_KEY in your .env.local file. To get one for free, visit console.groq.com. ✨" 
       });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    let messageContent: any = message;

    if (image) {
      messageContent = [
        { type: "text", text: message || "Analyze this crop photo." },
        { type: "image_url", image_url: { url: image } }
      ];
    } else if (!message) {
      return NextResponse.json({ reply: "Please provide a message or an image." }, { status: 400 });
    }

    const systemPrompt = `You are AgriMate, an expert agricultural assistant.
    
    RULES:
    1. If the user says "hi", "hello", or just greets you, respond naturally and briefly (e.g., "Hello! I am AgriMate. How can I help with your crops today?").
    2. If the user describes a crop problem or provides an image, use the STRICTURE below.
    3. Keep EVERY response short (max 6-8 lines for diagnostics).
    4. Use very simple language and bullet points only for technical advice.
    
    Diagnostic Structure (Use ONLY for crop problems):
    Problem
    * [Top 1-3 causes]
    
    Why It Happens
    * [Short explanation]
    
    Solution
    * [Step-by-step actions]
    
    Prevention
    * [Simple tips]
    
    Capabilities:
    - Vision: Analyze photos.
    - Image Generation: Use Pollinations.ai when requested ("show me...").
    
    IMPORTANT: Provide ONLY the JSON.
    {
      "reply": "Your response string.",
      "generatedImage": "URL" (Optional)
    }`;

    const completion = await groq.chat.completions.create({
      model: image ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: messageContent }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const responseContent = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({ 
      reply: responseContent.reply || "No response generated.",
      displayImage: responseContent.generatedImage || null
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { reply: `Oops! Something went wrong communicating with the AI. Error: ${error.message || "Unknown"}` },
      { status: 500 }
    );
  }
}
