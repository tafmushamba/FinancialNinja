import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key" });

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

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userQuery }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
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
      
      Respond with JSON in this format:
      {
        "insights": [
          "Insight 1",
          "Insight 2"
        ],
        "recommendations": [
          "Recommendation 1",
          "Recommendation 2"
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a financial analysis AI that provides insights and recommendations based on financial data." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    return {
      insights: parsedResponse.insights || [],
      recommendations: parsedResponse.recommendations || []
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
      
      Respond with JSON in this format:
      {
        "topics": [
          "Topic 1 - Description",
          "Topic 2 - Description"
        ],
        "resources": [
          "Resource 1 - Description",
          "Resource 2 - Description"
        ],
        "timeframe": "Suggested timeframe for completing this plan"
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are an educational AI that creates personalized learning plans for financial literacy." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    return {
      topics: parsedResponse.topics || [],
      resources: parsedResponse.resources || [],
      timeframe: parsedResponse.timeframe || "4 weeks"
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
