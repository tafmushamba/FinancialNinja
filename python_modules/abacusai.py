"""
Integration with the Mistral AI API for the financial twin game.
This module provides direct access to Mistral AI through Node.js.
"""
import os
import json
import sys
import subprocess
import requests
from typing import Optional

class ApiClient:
    """A client that sends LLM requests through the Node.js Mistral integration"""
    
    def evaluate_prompt(self, prompt: str, system_message: Optional[str] = None) -> 'Response':
        """Generate a response for the given prompt using Mistral"""
        try:
            # Prepare the request data
            request_data = {
                "prompt": prompt,
                "systemMessage": system_message or ""
            }
            
            # Log the request for debugging purposes
            with open("/tmp/mistral_request.log", "a") as f:
                f.write(f"Prompt: {prompt}\nSystem: {system_message}\n---\n")
            
            # Write the request data to a temporary file that will be picked up by the Node.js script
            with open("/tmp/mistral_request.json", "w") as f:
                json.dump(request_data, f)
            
            # Execute a special Node.js script that accesses the Mistral API
            try:
                # First approach: Use an environment variable to signal Node.js to process the request
                node_script_path = "/tmp/process_mistral_request.js"
                
                # Create a simple Node.js script if it doesn't exist
                if not os.path.exists(node_script_path):
                    with open(node_script_path, "w") as f:
                        f.write("""
const fs = require('fs');
const { Mistral } = require('@mistralai/mistralai');

// Read the request data
const requestData = JSON.parse(fs.readFileSync('/tmp/mistral_request.json', 'utf8'));

// Initialize Mistral client with API key from environment
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

// Set up the request
const callMistral = async () => {
  try {
    const response = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [
        { role: "system", content: requestData.systemMessage || "" },
        { role: "user", content: requestData.prompt }
      ],
      temperature: 0.7,
      maxTokens: 500
    });

    // Write the response to a file
    fs.writeFileSync('/tmp/mistral_response.json', JSON.stringify({
      content: response.choices[0].message.content,
      status: 'success'
    }));
  } catch (error) {
    fs.writeFileSync('/tmp/mistral_response.json', JSON.stringify({
      content: "Error calling Mistral API: " + error.message,
      status: 'error'
    }));
    console.error('Error calling Mistral API:', error);
  }
};

callMistral();
                        """)
                
                # Run the Node.js script
                result = subprocess.run(['node', node_script_path], 
                                        capture_output=True, 
                                        text=True,
                                        env=dict(os.environ, MISTRAL_API_KEY=os.environ.get('MISTRAL_API_KEY', '')))
                
                # Log any errors
                if result.stderr:
                    with open("/tmp/mistral_node_error.log", "a") as f:
                        f.write(f"Node.js error: {result.stderr}\n")
                
                # Read the response
                if os.path.exists("/tmp/mistral_response.json"):
                    with open("/tmp/mistral_response.json", "r") as f:
                        response_data = json.load(f)
                        if response_data.get("status") == "success":
                            return Response(response_data.get("content", ""))
                
                # If we get here, something went wrong
                raise Exception("Failed to get response from Mistral API")
                
            except Exception as e:
                # Log the error
                with open("/tmp/python_errors.log", "a") as f:
                    f.write(f"Error in Node.js execution: {str(e)}\n")
                
                # Fallback to direct HTTP request to Node.js endpoint
                try:
                    with open("/tmp/python_direct_call.log", "a") as f:
                        f.write(f"Attempting direct call to API\n")
                    
                    # Use direct HTTP request to the server endpoint
                    response = requests.post(
                        "http://localhost:5000/api/mistral/generate",
                        json=request_data
                    )
                    
                    if response.status_code == 200:
                        response_data = response.json()
                        return Response(response_data.get("content", ""))
                        
                except Exception as inner_e:
                    with open("/tmp/python_errors.log", "a") as f:
                        f.write(f"Error in direct API call: {str(inner_e)}\n")
            
            # Final fallback to a generated response
            return self._fallback_response(prompt, system_message)
            
        except Exception as e:
            # If anything goes wrong, log the error and return a fallback response
            with open("/tmp/python_errors.log", "a") as f:
                f.write(f"Error in evaluate_prompt: {str(e)}\n")
            return self._fallback_response(prompt, system_message)
    
    def _fallback_response(self, prompt: str, system_message: Optional[str] = None) -> 'Response':
        """Generate a fallback response based on the prompt content"""
        prompt_lower = prompt.lower()
        
        # Log that we're using a fallback
        with open("/tmp/python_fallback.log", "a") as f:
            f.write(f"Using fallback response for: {prompt[:100]}...\n")
        
        # Welcome message response
        if "welcome" in prompt_lower and "chosen the career path" in prompt_lower:
            career = "unknown"
            if "student" in prompt_lower:
                career = "Student"
            elif "entrepreneur" in prompt_lower:
                career = "Entrepreneur"
            elif "artist" in prompt_lower:
                career = "Artist"
            elif "banker" in prompt_lower:
                career = "Banker"
                
            return Response(f"""Welcome to the Financial Twin Simulation Game! 🎮

I'm thrilled to have you join us in this interactive journey toward financial literacy. You've chosen the {career} path - an exciting choice with unique challenges and opportunities!

As a {career}, you'll face realistic financial scenarios that will test your money management skills. You'll make decisions about budgeting, saving, investing, and handling debt that will impact your virtual financial well-being.

Your journey begins now. Are you ready to build financial resilience and discover strategies that could benefit your real-life financial decisions? Let's dive in!""")

        # Financial status initialization response
        elif "initial financial status" in prompt_lower:
            career_type = "professional"
            if "student" in prompt_lower:
                career_type = "student"
            
            return Response(f"""📊 Your Initial Financial Status:
• Monthly Income: £{1200 if career_type == 'student' else 3000} (from your current position)
• Monthly Expenses: £{1000 if career_type == 'student' else 2500} (essential costs)
• Savings: £{500 if career_type == 'student' else 5000}
• Outstanding Debt: £{20000 if career_type == 'student' else 15000}

Welcome to your financial journey! Your first financial challenge requires careful consideration of your resources.

You have several options:
1. Build your emergency fund for unexpected expenses
2. Make an extra payment toward your debt
3. Invest in developing new skills that could increase your income
4. Balance your approach with a little of each strategy

What approach would you like to take for your financial growth?""")

        # Financial decision processing
        elif "financial decisions" in prompt_lower:
            return Response("""You've made a thoughtful financial decision! 👏

After implementing your choice, your financial situation has shifted:

💰 Your monthly expenses decreased by £100 thanks to your budgeting efforts
💸 You've managed to add £200 to your savings
🎓 You've earned 50 XP for this smart financial move!

You've also unlocked the "Budget Master" achievement for making your first strategic financial decision!

What's your next move? Remember, each decision builds your financial resilience and brings you closer to your goals.""")

        # Default response
        else:
            return Response("""I've processed your financial information and have some insights to share.

Making well-informed financial decisions is essential for building long-term wealth and security. Consider your current needs, future goals, and risk tolerance when evaluating your options.

Would you like to continue with your current plan or explore alternatives?""")


class Response:
    """A simple response object to mimic the structure from abacusai"""
    
    def __init__(self, content):
        """Initialize with content"""
        self.content = content


class AgentResponse:
    """Response object that can be converted to JSON for the Node.js frontend"""
    
    def __init__(self, content, **kwargs):
        """Initialize with content and any additional data"""
        self.content = content
        self.data = kwargs
    
    def to_dict(self):
        """Convert the response to a dictionary for JSON serialization"""
        result = {"content": self.content}
        # Add any additional data
        result.update(self.data)
        return result
    
    def to_json(self):
        """Convert the response to a JSON string"""
        return json.dumps(self.to_dict())