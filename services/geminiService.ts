import { GoogleGenAI } from "@google/genai";
import { Trip } from "../types";

// Vite uses import.meta.env instead of process.env
// The variable MUST start with VITE_ to be accessible in the browser
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI(apiKey); // Pass the string directly or as { apiKey }

export const analyzeTrips = async (trips: Trip[]) => {
  if (!apiKey) {
    return "API Key is missing. Please check your environment variables.";
  }
  
  if (trips.length === 0) return "No trip data available for analysis.";

  const prompt = `Analyze the following truck trip data and provide 3-4 key insights for the owner. 
  Focus on fuel efficiency, driver performance, and cost hotspots (fines/deductions). 
  Data: ${JSON.stringify(trips.slice(0, 50))}`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error generating insights. Please try again later.";
  }
};
