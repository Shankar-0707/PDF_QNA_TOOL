import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
// Ensure dotenv is configured here if this file needs the API key directly
// dotenv.config(); // Assuming you do this in server.js, but good practice here too.

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  
});
const model = "gemini-2.5-flash";


/**
 * Generates a concise summary for a given text.
 * @param {string} text - The text to summarize.
 */
export async function generateSummary(text) {
    const prompt = `Please Provide a concise and professional summary of the following document text. The summary should be easy to understand and capture all main points:\n\n---\n\n${text}`;

    // Contents is correctly formatted
    const response = await ai.models.generateContent({
        model : model,
        contents : [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text2 = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text2?.trim() || '';
};

/**
 * Answers a question based on the provided document context.
 * @param {string} context - The document text to use as context.
 * @param {string} question - The user's question.
 */
export async function answerQuestion(context, question) {
    const prompt = `Based *only* on the provided context, answer the following question. If the information is not in the context, state politely that you cannot answer.
    
    CONTEXT:\n---\n${context}\n---\n
    QUESTION: ${question}`;

    // 💡 FIX APPLIED: Content is now correctly wrapped in the required object structure
    const response = await ai.models.generateContent({
        model : model,
        contents : [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text2 = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text2?.trim() || '';
}