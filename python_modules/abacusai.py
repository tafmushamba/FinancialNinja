"""
Simplified implementation of the abacusai module for the financial twin game.
This allows us to run the game without the actual external dependency.
"""
import json
import random

class ApiClient:
    """A simplified ApiClient that generates responses without external API calls"""
    
    def evaluate_prompt(self, prompt, system_message=None):
        """Generate a response for the given prompt"""
        # Financial career path responses
        career_path_intros = {
            "Student": "Welcome to your financial journey as a Student! You're starting with a modest income and higher debt due to student loans, but you have great growth potential.",
            "Entrepreneur": "Welcome to your entrepreneurial journey! You're starting with a moderate income, significant initial business debt, but high growth potential and flexibility.",
            "Artist": "Welcome to your creative financial journey! As an Artist, you have varying income streams, lower initial debt, and the opportunity to grow your brand and earnings over time.",
            "Banker": "Welcome to your financial career! As a Banker, you're starting with a higher income, lower debt, and knowledge of financial systems to maximize your growth."
        }
        
        # Financial scenario responses
        financial_responses = {
            "Welcome": "Welcome to the Financial Twin Simulation! Your virtual financial journey begins now. Make wise decisions to build wealth and financial stability.",
            "Initialize": "Your financial twin has been initialized. You'll face various financial challenges and opportunities throughout this simulation.",
            "Decision": "Your financial decision has been processed. Keep making thoughtful choices to improve your financial situation.",
            "Conclude": "Congratulations on completing this session of the Financial Twin Simulation! Your financial decisions have shaped your virtual financial future."
        }
        
        # Choose appropriate response type based on prompt content
        if "welcome" in prompt.lower() or "joined the game" in prompt.lower():
            # Extract career path if present
            for career in ["Student", "Entrepreneur", "Artist", "Banker"]:
                if career.lower() in prompt.lower():
                    return Response(career_path_intros.get(career, financial_responses["Welcome"]))
            return Response(financial_responses["Welcome"])
        
        elif "initial financial status" in prompt.lower():
            return Response(financial_responses["Initialize"])
        
        elif "decision impact" in prompt.lower() or "financial choices" in prompt.lower():
            return Response(financial_responses["Decision"])
        
        elif "conclude" in prompt.lower() or "summary" in prompt.lower():
            return Response(financial_responses["Conclude"])
        
        else:
            return Response("Your financial journey continues. Make your next decision wisely.")

class Response:
    """A simple response object to mimic the structure from abacusai"""
    
    def __init__(self, content):
        self.content = content

class AgentResponse:
    """Response object that can be converted to JSON for the Node.js frontend"""
    
    def __init__(self, content, **kwargs):
        self.content = content
        self.data = kwargs
    
    def to_dict(self):
        """Convert the response to a dictionary for JSON serialization"""
        result = {"content": self.content}
        result.update(self.data)
        return result