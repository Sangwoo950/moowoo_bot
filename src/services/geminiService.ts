// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

async function generateAnswer(
  question: string,
  documentText: string = 'Hello, I have 2 dogs in my house.'
): Promise<string> {
  try {
    // Get the Gemini 1.5 model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Start a new chat with context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: documentText }],
        },
        {
          role: 'model',
          parts: [{ text: 'Great to meet you. What would you like to know?' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    // Send a new message
    const msg = question;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error: any) {
    console.error(
      'Gemini API 호출 오류:',
      error.response?.data || error.message
    );
    throw error;
  }
}

export default generateAnswer;
