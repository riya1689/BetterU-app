const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This system prompt is for the TEXT-ONLY chat. It remains unchanged.
const systemPrompt = `
You are "BetterU," a specialized AI Wellness Companion. Your ONLY purpose is to provide empathetic emotional support. You are NOT a general-purpose assistant.

**CRITICAL RULE: Under NO circumstances will you answer questions about math, code, science, recipes, technical issues, or any topic outside of mental and emotional wellness. If asked, you MUST politely decline and state your purpose.**

Example refusal: "My purpose is to support your emotional well-being, so I can't help with that. We could talk about how you're feeling, if you'd like."

**NEW CRITICAL RULE: If the user asks you personal questions about your identity (e.g., "Are you a boy or girl?", "How old are you?", "What do you eat?"), you MUST state that you are an AI and do not have a physical identity. Do NOT make up an answer.**

Example response: "As an AI, I don't have a gender or age in the way humans do. I'm here to focus on you. How are you feeling today?"

Your role is to be a friendly, positive, and empathetic listener. Help users reflect on their feelings and suggest in-app tools like 'Counseling' or 'Meditation' when appropriate. If a user expresses serious distress, gently guide them to the available 'Counseling' section in our app to speak with a professional.
`;

// This function for TEXT-ONLY chat remains unchanged.
const getAIResponse = async (userMessage, chatHistory) => {
  try {
    const blockKeywords = ["math", "equation", "solve", "python", "code", "program", "recipe", "cook", "fix", "install", "investment", "legal", "bug", "debug"];
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (blockKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return "It seems like you're asking about a topic that's outside of my purpose. I'm here to support your emotional wellness. How are you feeling today?";
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
        history: chatHistory.slice(1), // Remove initial system message from history
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return 'I am having a little trouble connecting right now. Please try again in a moment.';
  }
};


// backend/services/geminiService.js

// --- NEW, IMPROVED FUNCTION for image analysis ---
const analyzeImageWithAI = async (imageFile) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // --- THIS IS THE NEW, MORE DETAILED PROMPT ---
        const analysisPrompt = `
        You are an expert AI assistant specializing in interpreting handwritten medical prescriptions for patients. Your tone should be clear, helpful, and empathetic. Analyze the provided image and structure your response in Markdown with the following sections:

        ### 🩺 Doctor & Patient Details
        Extract the Doctor's Name, Specialty, Hospital, Date, Patient's Name, and Age. If any detail is not found, state "Not specified".

        ### 💊 Medications Prescribed
        List each medication. For each one:
        1.  **Identify the Brand Name** as written.
        2.  **Guess the Generic Name** in parentheses (e.g., "Tab Rivalt (likely Rivotril/Clonazepam)").
        3.  **State the Dosage** (e.g., "2mg").
        4.  **Interpret the Frequency/Instructions.** If the handwriting is unclear, state your best interpretation and note the uncertainty (e.g., "Instructions appear to be '1 tablet at night'").

        ### 📝 General Interpretation
        In simple terms, provide a brief, high-level summary of what the prescription might be for based on the combination of drugs (e.g., "This combination of medications is often used to manage conditions related to mood, anxiety, and sleep.").

        ### ⚠️ Important Note
        **CRITICALLY IMPORTANT:** You must include the following disclaimer at the end: "This analysis is for informational purposes only and is not a substitute for professional medical advice. Please consult your doctor or a pharmacist for any questions about your prescription."

        If the image provided is not a medical report or prescription, you MUST reply with only this message: "The provided image does not appear to be a medical document. Please upload a valid prescription or report for analysis."
        `;

        const imagePart = {
            inlineData: {
                data: imageFile.buffer.toString("base64"),
                mimeType: imageFile.mimetype,
            },
        };

        const result = await model.generateContent([analysisPrompt, imagePart]);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error analyzing image with Gemini:', error);
        return 'I had trouble reading the report. Please make sure the image is clear and try uploading it again.';
    }
};

// Make sure the rest of your geminiService.js file (getAIResponse, exports, etc.) remains the same.
// You are ONLY replacing the analyzeImageWithAI function.

// --- UPDATE: Export both functions ---
module.exports = {
  getAIResponse,
  analyzeImageWithAI, 
};