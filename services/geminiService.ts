
import { GoogleGenAI, Type } from "@google/genai";
import { Trip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrips = async (trips: Trip[]) => {
  if (trips.length === 0) return "No trip data available for analysis.";

  const prompt = `Analyze the following truck trip data and provide 3-4 key insights for the owner. 
  Focus on fuel efficiency, driver performance, and cost hotspots (fines/deductions). 
  Data: ${JSON.stringify(trips.slice(0, 50))}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error generating insights. Please try again later.";
  }
};
