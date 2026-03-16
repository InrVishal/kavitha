const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a disaster response analysis or instruction
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
async function generateTacticalAdvice(prompt) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
    return "Tactical analysis unavailable. Reverting to local heuristic models.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    return text || "Tactical analysis unavailable. Reverting to local heuristic models.";
  } catch (error) {
    console.error("Gemini API Error Detail:", error.message || error);
    return "Tactical analysis unavailable. Reverting to local heuristic models.";
  }
}

module.exports = {
  generateTacticalAdvice
};
