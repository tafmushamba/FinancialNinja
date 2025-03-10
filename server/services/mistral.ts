import { Mistral } from "@mistralai/mistralai";

// Initialize Mistral client with API key
// When developing with Mistral AI, you'll need a valid API key
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "dummy_key"
});

// Default model - Using Mistral's most capable model
// Current available models include: "open-mistral-7b", "open-mixtral-8x7b", "mistral-small-latest", "mistral-medium-latest", "mistral-large-latest"
const DEFAULT_MODEL = "mistral-medium-latest";

/**
 * Generates personalized financial insights based on user query
 */
export async function generateFinancialInsight(userQuery: string): Promise<string> {
  try {
    // Define a system message that establishes the assistant as a financial expert
    const systemMessage = `
      You are a financial literacy assistant for a platform called FinByte.
      You specialize in explaining financial concepts in a clear, concise manner.
      Your goal is to help users improve their financial knowledge and make better financial decisions.
      
      When responding, prioritize:
      1. Accuracy - Never provide financial advice, only educational information
      2. Simplicity - Explain concepts in plain language
      3. Actionable insights - Give users practical information they can apply
      4. Neutrality - Don't recommend specific financial products
      
      Limit responses to 2-3 paragraphs unless the question is complex.
    `;

    // Using the chat.complete method as shown in Mistral documentation
    const response = await client.chat.complete({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userQuery }
      ],
      temperature: 0.7,
      maxTokens: 500
    });

    // Safely extract the content from the response
    let content = "I'm sorry, I couldn't generate a response. Please try again.";
    if (response.choices && 
        response.choices.length > 0 && 
        response.choices[0].message && 
        typeof response.choices[0].message.content === 'string') {
      content = response.choices[0].message.content;
    }
    
    return content;
  } catch (error) {
    console.error("Error generating financial insight:", error);
    return "I'm currently having trouble connecting to my knowledge base. Please try again later or ask another question.";
  }
}

/**
 * Analyzes financial data to generate personalized recommendations
 */
export async function analyzeFinancialData(
  expenses: { category: string, amount: number }[],
  income: number,
  savingsGoal: number
): Promise<{ insights: string[], recommendations: string[] }> {
  try {
    const financialData = {
      expenses,
      income,
      savingsGoal
    };
    
    const prompt = `
      Analyze this financial data and provide insights and recommendations:
      ${JSON.stringify(financialData)}
      
      Respond with a JSON object containing two arrays: "insights" and "recommendations".
      Each array should contain 2-4 short, actionable statements.
    `;

    const response = await client.chat.complete({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a financial analysis AI that provides insights and recommendations based on financial data. Always respond with valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      responseFormat: { type: "json_object" }
    });

    // Extract and parse the JSON from the response
    let parsedData = { insights: [], recommendations: [] };
    
    try {
      // Make sure we have a valid response
      if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
        throw new Error("Invalid response structure");
      }
      
      const responseText = response.choices[0].message.content;
      
      // Check if responseText is a string before parsing
      if (typeof responseText === 'string') {
        parsedData = JSON.parse(responseText);
      } else {
        throw new Error("Response content is not a string");
      }
    } catch (e) {
      console.error("Error parsing JSON response:", e);
    }

    return {
      insights: parsedData.insights || [],
      recommendations: parsedData.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing financial data:", error);
    return {
      insights: ["Unable to analyze financial data at this time."],
      recommendations: ["Try again later."]
    };
  }
}

/**
 * Creates a personalized learning plan based on user knowledge and goals
 */
export async function createLearningPlan(
  currentKnowledge: string,
  financialGoals: string[]
): Promise<{ topics: string[], resources: string[], timeframe: string }> {
  try {
    const userData = {
      currentKnowledge,
      financialGoals
    };
    
    const prompt = `
      Create a personalized financial learning plan based on this user data:
      ${JSON.stringify(userData)}
      
      Respond with a JSON object containing:
      - "topics": an array of important topics to learn with brief descriptions
      - "resources": an array of suggested resources for learning
      - "timeframe": a suggested timeframe for completing this plan
    `;

    const response = await client.chat.complete({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are an educational AI that creates personalized learning plans for financial literacy. Always respond with valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      responseFormat: { type: "json_object" }
    });

    // Extract and parse the JSON from the response
    let parsedData = { topics: [], resources: [], timeframe: "4 weeks" };
    
    try {
      // Make sure we have a valid response
      if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
        throw new Error("Invalid response structure");
      }
      
      const responseText = response.choices[0].message.content;
      
      // Check if responseText is a string before parsing
      if (typeof responseText === 'string') {
        parsedData = JSON.parse(responseText);
      } else {
        throw new Error("Response content is not a string");
      }
    } catch (e) {
      console.error("Error parsing JSON response:", e);
    }

    return {
      topics: parsedData.topics || [],
      resources: parsedData.resources || [],
      timeframe: parsedData.timeframe || "4 weeks"
    };
  } catch (error) {
    console.error("Error creating learning plan:", error);
    return {
      topics: ["Basic budgeting", "Saving strategies", "Understanding credit"],
      resources: ["Default resources unavailable"],
      timeframe: "4 weeks"
    };
  }
}