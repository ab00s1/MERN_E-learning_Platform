const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const resolveDoubt = async (req, res) => {
  try {
    const { course, doubt, history } = req.body;
    if (!course || !doubt) {
      return res.status(400).json({ error: "Course and doubt are required." });
    }

    // Build chat history into the prompt
    let historyPrompt = "";
    if (Array.isArray(history) && history.length > 0) {
      history.forEach((msg, idx) => {
        historyPrompt += `${msg.role === "user" ? "User" : "AI"}: ${msg.message}\n`;
      });
    }
    
    // Compose a prompt for the AI
    const prompt = `Course Name: ${course}\nDoubt: ${doubt}\nAnswer this doubt in a clear and concise manner.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const answer = response.text || response.content || "No answer generated.";
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Error resolving doubt:", error);
    return res.status(500).json({ error: "Failed to resolve doubt." });
  }
};

module.exports = { resolveDoubt };