
import { GoogleGenAI } from "@google/genai";
import { Trip } from "../types";

export const analyzeTrips = async (trips: Trip[]) => {
  if (trips.length === 0) return "No trip data available for analysis.";

  // Use the shimmed process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "") {
    console.error("Gemini API Key is missing. Please set the API_KEY environment variable in your VPS/Docker environment.");
    return "Operational Insights: [Configuration Required] Please contact system administrator to enable AI Analytics.";
  }

  const prompt = `Analyze the following truck trip data and provide 3-4 key insights for the owner. 
  Focus on fuel efficiency, driver performance, and cost hotspots (fines/deductions). 
  Data: ${JSON.stringify(trips.slice(0, 50))}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
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
    return "Operational Insights: Analysis temporarily unavailable due to connectivity or authorization issues.";
  }
};
