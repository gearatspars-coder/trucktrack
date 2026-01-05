import { GoogleGenAI } from "@google/genai";
import { Trip } from "../types";

/**
 * Analyzes fleet trip data using Gemini AI.
 * Adheres to strict @google/genai guidelines.
 */
export const analyzeTrips = async (trips: Trip[]) => {
  if (trips.length === 0) return "No trip data available for analysis.";

  const prompt = `Analyze the following truck trip data and provide 3-4 key insights for the fleet owner. 
  Focus on fuel efficiency, driver performance patterns, and cost hotspots. 
  Data: ${JSON.stringify(trips.slice(0, 50))}`;

  try {
    // Standard initialization using process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Operational Insights: Analysis returned no data.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Operational Insights: AI analysis is currently unavailable.";
  }
};