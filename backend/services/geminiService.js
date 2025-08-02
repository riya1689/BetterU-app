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


// --- NEW FUNCTION for image analysis ---
const analyzeImageWithAI = async (imageFile, textPrompt) => {
    try {
        // Use the Gemini 1.5 Flash model, which is multimodal
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // This is the specific instruction we give the AI for how to analyze the report.
        const analysisPrompt = `
        You are an AI medical report analyzer. Analyze the following medical document and extract information clearly and concisely. The user is a patient, so use simple language. Structure your response in Markdown format with the following sections:

        ### 📋 Report Summary
        Briefly describe the main points of the report.
        
        ### 🧪 Tests Prescribed
        List all diagnostic tests mentioned (e.g., "Blood Test," "X-Ray"). If none are mentioned, state "No tests were prescribed in this report."
        
        ### 💊 Medications
        List all prescribed medications, including dosage if available (e.g., "Paracetamol 500mg"). If none are mentioned, state "No medications were prescribed in this report."
        
        ### 🩺 Doctor's Advice
        Summarize any other advice, notes, or follow-up instructions from the doctor.
        `;

        // Convert the image buffer from Multer into the format Gemini needs
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

// --- UPDATE: Export both functions ---
module.exports = {
  getAIResponse,
  analyzeImageWithAI, 
};