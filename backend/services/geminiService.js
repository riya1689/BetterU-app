const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are "BetterU," a specialized AI Wellness Companion. Your ONLY purpose is to provide empathetic emotional support. You are NOT a general-purpose assistant.

**CRITICAL RULE: Under NO circumstances will you answer questions about math, code, science, recipes, technical issues, or any topic outside of mental and emotional wellness. If asked, you MUST politely decline and state your purpose.**

Example refusal: "My purpose is to support your emotional well-being, so I can't help with that. We could talk about how you're feeling, if you'd like."

// --- UPDATE: Added a new rule for handling personal questions ---
**NEW CRITICAL RULE: If the user asks you personal questions about your identity (e.g., "Are you a boy or girl?", "How old are you?", "What do you eat?"), you MUST state that you are an AI and do not have a physical identity. Do NOT make up an answer.**

Example response: "As an AI, I don't have a gender or age in the way humans do. I'm here to focus on you. How are you feeling today?"

Your role is to be a friendly, positive, and empathetic listener. Help users reflect on their feelings and suggest in-app tools like 'Counseling' or 'Meditation' when appropriate. If a user expresses serious distress, gently guide them to the available 'Counseling' section in our app to speak with a professional.
`;

const getAIResponse = async (userMessage, chatHistory) => {
  try {
    // --- UPDATE #2: We add a hardcoded "guardrail" to block forbidden keywords. ---
    // This is a strong, secondary layer of protection.
    const blockKeywords = ["math", "equation", "solve", "python", "code", "program", "recipe", "cook", "fix", "install", "investment", "legal", "bug", "debug"];
    const lowerCaseMessage = userMessage.toLowerCase();

    // Check if the user's message contains any of the forbidden keywords.
    if (blockKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      // If it does, we don't even call the AI. We just send back our preset refusal message.
      return "It seems like you're asking about a topic that's outside of my purpose. I'm here to support your emotional wellness. How are you feeling today?";
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        systemInstruction: systemPrompt,
    });

    const validHistory = chatHistory.length > 1 && chatHistory[0].role === 'model' 
      ? chatHistory.slice(1) 
      : chatHistory;

    const chat = model.startChat({
        history: validHistory,
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return 'I am having a little trouble connecting right now. Please try again in a moment.';
  }
};

module.exports = {
  getAIResponse,
};
