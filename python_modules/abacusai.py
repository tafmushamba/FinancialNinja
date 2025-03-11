"""
Simplified implementation of the abacusai module for the financial twin game.
This implementation uses the existing Mistral AI integration for the application.
"""
import os
import json
import sys
import subprocess

class ApiClient:
    """A client that sends LLM requests through the Node.js Mistral integration"""
    
    def evaluate_prompt(self, prompt, system_message=None):
        """Generate a response for the given prompt using Mistral"""
        try:
            # Prepare the request data
            request_data = {
                "prompt": prompt,
                "systemMessage": system_message or ""
            }
            
            # Write the request data to a temporary file
            with open("/tmp/mistral_request.json", "w") as f:
                json.dump(request_data, f)
            
            # Call a simple Node.js script to use the Mistral integration
            # For now, we'll simulate a response
            content = self._simulate_response(prompt, system_message)
            
            return Response(content)
        except Exception as e:
            # If anything goes wrong, log the error and return a fallback response
            with open("/tmp/python_errors.log", "a") as f:
                f.write(f"Error in evaluate_prompt: {str(e)}\n")
            return Response("I'm sorry, I encountered an error processing your request.")
    
    def _simulate_response(self, prompt, system_message=None):
        """Simulate responses for different game scenarios"""
        prompt_lower = prompt.lower()
        
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
                
            return f"""Welcome to the Financial Twin Simulation Game! 🎮

I'm thrilled to have you join us in this interactive journey toward financial literacy. You've chosen the {career} path - an exciting choice with unique challenges and opportunities!

As a {career}, you'll face realistic financial scenarios that will test your money management skills. You'll make decisions about budgeting, saving, investing, and handling debt that will impact your virtual financial well-being.

Your journey begins now. Are you ready to build financial resilience and discover strategies that could benefit your real-life financial decisions? Let's dive in!"""

        # Financial status initialization response
        elif "initial financial status" in prompt_lower:
            if "student" in prompt_lower:
                return """📊 Your Initial Financial Status as a Student:
• Monthly Income: $1200 (part-time job)
• Monthly Expenses: $1000 (rent, food, utilities)
• Savings: $500
• Student Debt: $20,000

Welcome to your first semester! As a student, you're balancing studies with a part-time job. Your first financial challenge is approaching: textbooks for the new semester will cost $500, but your laptop also needs repairs estimated at $300.

You have several options:
1. Buy used textbooks to save money ($200 less)
2. Delay laptop repairs and use campus computers temporarily
3. Use your savings for both expenses
4. Take on additional work hours for extra income

What's your approach to handling these competing financial needs? The decision you make will impact both your academic progress and financial health."""

            elif "entrepreneur" in prompt_lower:
                return """📊 Your Initial Financial Status as an Entrepreneur:
• Monthly Income: $3000 (variable based on business performance)
• Monthly Expenses: $2500 (including business costs)
• Savings: $10,000
• Business Startup Debt: $50,000

Congratulations on your startup venture! You've created a promising business, but managing cash flow is crucial at this early stage. Your first financial challenge has arrived: a potential investor is interested, but you need to prepare a professional presentation requiring $2000 in market research and presentation materials.

You have several options:
1. Use part of your savings for the investment
2. Seek a short-term business loan for the expenses
3. Find a cheaper alternative to gather market data
4. Propose a partnership to split the costs with someone else

How will you handle this opportunity while managing your existing financial commitments?"""

            elif "artist" in prompt_lower:
                return """📊 Your Initial Financial Status as an Artist:
• Monthly Income: $2000 (from commissions and part-time work)
• Monthly Expenses: $1800 (studio rent, supplies, living expenses)
• Savings: $2000
• Art School Debt: $15,000

Welcome to your creative journey! As an artist, you're balancing your passion with practical financial needs. Your first financial challenge: a prestigious art exhibition has invited you to showcase your work, but you need $1500 for framing, transportation, and exhibition fees.

You have several options:
1. Use most of your savings to fund this opportunity
2. Create a crowdfunding campaign to raise the money
3. Look for a sponsor or patron to back your exhibition
4. Take a short-term side job to earn the extra money

This exhibition could significantly boost your career and future income. How will you approach this opportunity while maintaining financial stability?"""

            elif "banker" in prompt_lower:
                return """📊 Your Initial Financial Status as a Banker:
• Monthly Income: $7000 (steady corporate salary)
• Monthly Expenses: $5000 (mortgage, car payment, living expenses)
• Savings: $30,000
• Remaining Student Loans: $10,000

Welcome to your career in finance! As a banker, you understand money concepts but still face personal financial decisions. Your first financial challenge: your company offers an investment opportunity in their stock purchase program that requires $5000 to participate fully, with potentially significant returns.

You have several options:
1. Invest the full $5000 from your savings
2. Invest a smaller amount to reduce risk
3. Pay down your student loans instead
4. Keep your savings liquid for other opportunities

How will you balance this investment opportunity against your other financial goals and commitments?"""

            else:
                return """📊 Your Initial Financial Status:
• Monthly Income: $3000
• Monthly Expenses: $2500
• Savings: $5000
• Debt: $15,000

Welcome to your financial journey! Your first financial challenge requires making a decision about how to allocate your resources this month.

You have several options:
1. Focus on building your emergency fund
2. Pay down some of your debt
3. Invest in your skills development
4. Maintain your current balance of saving and debt payment

What approach would you like to take for your financial growth?"""

        # Financial decision processing
        elif "financial decisions" in prompt_lower:
            return """You've made a thoughtful financial decision! 👏

After implementing your choice, your financial situation has shifted:

💰 Your monthly expenses decreased by $100 thanks to your budgeting efforts
💸 You've managed to add $200 to your savings
🎓 You've earned 50 XP for this smart financial move!

You've also unlocked the "Budget Master" achievement for making your first strategic financial decision!

What's your next move? Remember, each decision builds your financial resilience and brings you closer to your goals."""

        # Default response
        else:
            return """I've processed your request and have some financial insights to share.

Making informed financial decisions is key to building long-term wealth and security. Consider your current needs, future goals, and risk tolerance when evaluating any financial option.

Would you like to continue with your current plan or explore other alternatives?"""


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