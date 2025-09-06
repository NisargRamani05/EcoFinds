import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { knowledge } from '@/lib/knowledge';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    // 1. Get the user's last message from the request
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // 2. Combine all your knowledge base content into one big string
    const context = knowledge
      .map(item => `Title: ${item.title}\nContent: ${item.content}`)
      .join('\n\n---\n\n');

    // 3. Create a single, simple prompt for the AI
    const prompt = `You are a helpful assistant for a platform called EcoFinds. Answer the user's question based ONLY on the context provided below. If the answer is not in the context, say "I'm sorry, I don't have information on that topic."

    CONTEXT:
    ---
    ${context}
    ---

    USER'S QUESTION:
    ${userMessage}

    ANSWER:`;

    // 4. Call the AI model and get the response
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Send the response back to the user
    return NextResponse.json({ text });

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}