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
  // Check if we have a real API key or just the dummy key
  const hasRealApiKey = process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY !== "dummy_key";
  
  // If we have a real API key, use the Mistral API
  if (hasRealApiKey) {
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
  // If we don't have a real API key, provide simulated responses
  else {
    console.log("Using simulated AI responses since no valid API key is available");
    
    // Simple keyword-based response system
    const lowerCaseQuery = userQuery.toLowerCase();
    
    if (lowerCaseQuery.includes("budget") || lowerCaseQuery.includes("budgeting")) {
      return "Creating a budget is an essential financial skill. Start by tracking all your income and expenses for a month to understand your spending patterns. Then, categorize your expenses into needs (rent, utilities, groceries), wants (entertainment, dining out), and savings/debt repayment. Aim to allocate about 50% to needs, 30% to wants, and 20% to savings and debt repayment, though these percentages can be adjusted based on your personal situation.\n\nThe key to successful budgeting is consistency and regular review. Many people find success with digital tools like budgeting apps, while others prefer spreadsheets or the envelope method. Remember that a budget isn't meant to restrict you—it's a plan that helps you spend intentionally on what matters most to you.";
    } 
    else if (lowerCaseQuery.includes("invest") || lowerCaseQuery.includes("investing")) {
      return "When starting to invest with a modest amount like £500, focus on low-cost, diversified options. Index funds or ETFs (Exchange-Traded Funds) are excellent choices for beginners as they provide instant diversification across many companies with minimal fees. Many investment platforms allow you to start with small amounts and set up regular contributions.\n\nBefore investing, ensure you have an emergency fund covering 3-6 months of expenses and have paid off high-interest debt. Remember that investing is a long-term strategy—aim to keep your money invested for at least 5-10 years to ride out market fluctuations. As your knowledge and portfolio grow, you can explore more diverse investment options.";
    }
    else if (lowerCaseQuery.includes("compound interest") || lowerCaseQuery.includes("compounding")) {
      return "Compound interest is often called the eighth wonder of the world because it allows your money to grow exponentially over time. It's the process of earning interest on both your initial investment (the principal) and on the interest you've already accumulated.\n\nHere's a simple example: If you invest £1,000 with an annual interest rate of 5%, after the first year you'd earn £50, giving you £1,050. In the second year, you earn 5% on £1,050 (not just on your original £1,000), which is £52.50, bringing your total to £1,102.50. This effect becomes dramatically more powerful over longer periods.\n\nIf you kept that same £1,000 invested for 30 years at 5% compound interest, you'd have about £4,322 without adding any more money. This demonstrates why starting to invest early is so important—you're giving compound interest more time to work its magic.";
    }
    else if (lowerCaseQuery.includes("debt") || lowerCaseQuery.includes("loan")) {
      return "Managing debt effectively starts with understanding the different types of debt you have. High-interest debt like credit cards (often 15-25% interest) should typically be prioritized for repayment before lower-interest debts like mortgages or student loans.\n\nTwo popular debt repayment strategies are the avalanche method (paying off highest interest rate debts first) and the snowball method (paying off smallest balances first for psychological wins). The avalanche method saves you the most money mathematically, but the snowball method can provide motivation through quick wins.\n\nWhile paying down debt, try to avoid taking on new debt. Create a realistic repayment plan that you can stick to, and consider whether consolidating debts might give you a lower overall interest rate. Remember that becoming debt-free is a journey that takes time—celebrate small victories along the way.";
    }
    else if (lowerCaseQuery.includes("save") || lowerCaseQuery.includes("saving")) {
      return "Effective saving starts with setting clear goals, whether short-term (emergency fund, vacation) or long-term (home purchase, retirement). For most people, building an emergency fund covering 3-6 months of essential expenses should be the first priority before moving on to other saving goals.\n\nAutomation is your strongest ally in saving money. Set up automatic transfers to your savings account on payday so you save before you have a chance to spend. Consider using separate accounts for different saving goals to track your progress more easily.\n\nLook for high-yield savings accounts for your emergency fund and short-term goals to earn more interest while maintaining liquidity. For longer-term goals (5+ years away), consider investment accounts which typically offer better returns over time, though with some market risk.";
    }
    else {
      return "Thank you for your question about " + userQuery + ". Financial literacy is a journey of continuous learning, and it's great that you're seeking information on this topic.\n\nWhile I don't have specific information on this exact query in my knowledge base, I'd recommend exploring reputable financial education resources like the Money Advice Service, financial education sections of bank websites, or personal finance books from authors like Martin Lewis or Dave Ramsey.\n\nIf you have more specific questions about budgeting, saving, investing, debt management, or retirement planning, I'd be happy to provide more detailed information in those areas.";
    }
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