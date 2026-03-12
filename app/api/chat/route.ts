import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

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
      // If an image is provided, construct a multimodal content array
      messageContent = [
        { type: "text", text: message || "What's in this image?" },
        { type: "image_url", image_url: { url: image } }
      ];
    } else if (!message) {
      return NextResponse.json({ reply: "Please provide a message or an image." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: image ? "llama-3.2-11b-vision-preview" : "llama-3.1-8b-instant", // Use Vision model if image is attached
      messages: [{ role: "user", content: messageContent }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({ reply: completion.choices[0]?.message?.content || "No response generated." });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { reply: `Oops! Something went wrong communicating with the AI. Error: ${error.message || "Unknown"}` },
      { status: 500 }
    );
  }
}
