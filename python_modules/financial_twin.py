"""
Financial Twin Simulation Game
This is the main module for the Financial Twin game, containing all the core game functions.
"""
import json
import random
import math
from typing import Dict, List, Any, Optional, Union

class AbacusResponse:
    """Simple response class to mimic the structure of API responses"""
    def __init__(self, content: str, **kwargs):
        self.content = content
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def to_dict(self):
        """Convert the response to a dictionary for JSON serialization"""
        return {k: v for k, v in self.__dict__.items()}
    
    def to_json(self):
        """Convert the response to a JSON string"""
        return json.dumps(self.to_dict())

# Career path starting data
CAREER_PATHS = {
    "Student": {
        "income": 800,
        "expenses": 650,
        "savings": 500,
        "debt": 5000
    },
    "Entrepreneur": {
        "income": 1200,
        "expenses": 1000,
        "savings": 2000,
        "debt": 10000
    },
    "Artist": {
        "income": 1000,
        "expenses": 850,
        "savings": 1000,
        "debt": 3000
    },
    "Banker": {
        "income": 3000,
        "expenses": 2500,
        "savings": 5000,
        "debt": 15000
    }
}

# Financial decision options
FINANCIAL_DECISIONS = {
    "savings_focus": {
        "effect": lambda data: {
            "savings": data["savings"] + (data["income"] - data["expenses"]) * 0.8,
            "debt": data["debt"],
            "xp_earned": data["xp_earned"] + 10,
            "message": "You've chosen to focus on building your savings. This is a prudent approach that will help you build financial security over time."
        }
    },
    "debt_payment": {
        "effect": lambda data: {
            "savings": data["savings"] + (data["income"] - data["expenses"]) * 0.2,
            "debt": max(0, data["debt"] - (data["income"] - data["expenses"]) * 0.8),
            "xp_earned": data["xp_earned"] + 15,
            "message": "You've chosen to focus on paying down your debt. This will reduce your interest payments and improve your financial health in the long run."
        }
    },
    "balanced_approach": {
        "effect": lambda data: {
            "savings": data["savings"] + (data["income"] - data["expenses"]) * 0.5,
            "debt": max(0, data["debt"] - (data["income"] - data["expenses"]) * 0.5),
            "xp_earned": data["xp_earned"] + 12,
            "message": "You've chosen a balanced approach between saving and debt reduction. This is a solid strategy for long-term financial health."
        }
    },
    "investment": {
        "effect": lambda data: {
            "savings": data["savings"] * 1.05 + (data["income"] - data["expenses"]) * 0.3,
            "debt": data["debt"],
            "xp_earned": data["xp_earned"] + 8,
            "message": "You've chosen to focus on investments. This may lead to higher returns over time but comes with some risk."
        }
    },
    "emergency_fund": {
        "effect": lambda data: {
            "savings": data["savings"] + (data["income"] - data["expenses"]) * 0.7,
            "debt": max(0, data["debt"] - (data["income"] - data["expenses"]) * 0.3),
            "xp_earned": data["xp_earned"] + 14,
            "message": "You've built up an emergency fund. This provides financial security and peace of mind in case of unexpected expenses."
        }
    },
    "budget_optimization": {
        "effect": lambda data: {
            "income": data["income"] * 1.03,
            "expenses": data["expenses"] * 0.95,
            "savings": data["savings"] + (data["income"] - data["expenses"]) * 0.5,
            "debt": max(0, data["debt"] - (data["income"] - data["expenses"]) * 0.5),
            "xp_earned": data["xp_earned"] + 18,
            "message": "You've optimized your budget, increasing income and reducing expenses. This creates more financial flexibility for your future."
        }
    }
}

# Random financial events
FINANCIAL_EVENTS = [
    {
        "name": "Unexpected Medical Expense",
        "effect": lambda data: {
            "expenses": data["expenses"] + 300,
            "savings": max(0, data["savings"] - 300),
            "message": "You had an unexpected medical expense. This highlights the importance of having health insurance and an emergency fund."
        },
        "probability": 0.15
    },
    {
        "name": "Car Repair",
        "effect": lambda data: {
            "expenses": data["expenses"] + 250,
            "savings": max(0, data["savings"] - 250),
            "message": "Your car needed an unexpected repair. Regular maintenance can help prevent some, but not all, unexpected expenses."
        },
        "probability": 0.2
    },
    {
        "name": "Bonus at Work",
        "effect": lambda data: {
            "income": data["income"] + 500,
            "savings": data["savings"] + 500,
            "message": "You received a bonus at work! Consider using windfalls like this to boost your emergency fund or pay down high-interest debt."
        },
        "probability": 0.1
    },
    {
        "name": "Tax Refund",
        "effect": lambda data: {
            "savings": data["savings"] + 800,
            "message": "You received a tax refund. While it feels like free money, remember it's actually your money that was over-withheld throughout the year."
        },
        "probability": 0.15
    },
    {
        "name": "Home Appliance Failure",
        "effect": lambda data: {
            "expenses": data["expenses"] + 400,
            "savings": max(0, data["savings"] - 400),
            "message": "A major home appliance failed and needed replacement. Budgeting for home maintenance can help prepare for these expenses."
        },
        "probability": 0.15
    }
]

# Achievement definitions
ACHIEVEMENTS = [
    {
        "name": "Debt Reducer",
        "condition": lambda data: data["initial_debt"] > 0 and data["debt"] < data["initial_debt"] * 0.7,
        "description": "Reduced debt by 30%",
        "xp_bonus": 20
    },
    {
        "name": "Savings Builder",
        "condition": lambda data: data["savings"] > data["initial_savings"] * 1.5,
        "description": "Increased savings by 50%",
        "xp_bonus": 25
    },
    {
        "name": "Budget Master",
        "condition": lambda data: data["income"] > data["initial_income"] * 1.1 and data["expenses"] < data["initial_expenses"] * 0.95,
        "description": "Optimized budget effectively",
        "xp_bonus": 30
    },
    {
        "name": "Emergency Prepared",
        "condition": lambda data: data["savings"] > data["expenses"] * 3,
        "description": "Built a 3-month emergency fund",
        "xp_bonus": 35
    },
    {
        "name": "Financial Balancer",
        "condition": lambda data: data["savings"] > 0 and data["debt"] < data["initial_debt"] * 0.8,
        "description": "Maintained savings while reducing debt",
        "xp_bonus": 25
    },
    {
        "name": "Debt Free",
        "condition": lambda data: data["initial_debt"] > 0 and data["debt"] == 0,
        "description": "Completely paid off all debt",
        "xp_bonus": 50
    }
]

# XP to level mapping
def get_level(xp: int) -> int:
    return math.floor(math.sqrt(xp) / 2) + 1

def welcome_node_function(player_name: str, career_choice: str) -> AbacusResponse:
    """
    Welcome function for new players starting the game
    
    Args:
        player_name: Player's name
        career_choice: Selected career path (Student, Entrepreneur, Artist, Banker)
        
    Returns:
        AbacusResponse containing welcome message and data
    """
    career = career_choice.capitalize()
    
    if career not in CAREER_PATHS:
        return AbacusResponse(
            content=f"Welcome, {player_name}! Unfortunately, '{career}' is not a recognized career path. Please choose from Student, Entrepreneur, Artist, or Banker.",
            error="Invalid career choice"
        )
    
    welcome_message = f"""Welcome to Financial Twin, {player_name}!

You've chosen the {career} path. Each career comes with its own financial starting point, including income, expenses, savings, and debts.

Your financial journey begins now. You'll make decisions that affect your financial health, experience random events, and work toward achieving financial goals.

Let's start by setting up your financial profile based on your career choice."""

    return AbacusResponse(
        content=welcome_message,
        player_name=player_name,
        career_path=career
    )

def initialize_financial_twin_function(career_path: str, acknowledge_status: str) -> AbacusResponse:
    """
    Initialize the financial data for the selected career path
    
    Args:
        career_path: Selected career path
        acknowledge_status: Acknowledgment of initial financial status
        
    Returns:
        AbacusResponse containing initial status and financial data
    """
    if career_path not in CAREER_PATHS:
        return AbacusResponse(
            content=f"Error: '{career_path}' is not a recognized career path.",
            error="Invalid career path"
        )
    
    financial_data = CAREER_PATHS[career_path].copy()
    
    # Add additional calculated fields
    monthly_savings = financial_data["income"] - financial_data["expenses"]
    debt_to_income_ratio = financial_data["debt"] / financial_data["income"] if financial_data["income"] > 0 else 0
    savings_ratio = financial_data["savings"] / financial_data["income"] if financial_data["income"] > 0 else 0
    
    # Initialize player stats
    financial_data["xp_earned"] = 0
    financial_data["level"] = 1
    financial_data["achievements"] = []
    
    # Store initial values for achievement tracking
    financial_data["initial_income"] = financial_data["income"]
    financial_data["initial_expenses"] = financial_data["expenses"]
    financial_data["initial_savings"] = financial_data["savings"]
    financial_data["initial_debt"] = financial_data["debt"]
    
    status_message = f"""Your Financial Starting Point ({career_path}):

Monthly Income: £{financial_data["income"]:,.2f}
Monthly Expenses: £{financial_data["expenses"]:,.2f}
Current Savings: £{financial_data["savings"]:,.2f}
Current Debt: £{financial_data["debt"]:,.2f}

Monthly Net Cash Flow: £{monthly_savings:,.2f}
Debt-to-Income Ratio: {debt_to_income_ratio:.2f}
Savings as % of Income: {savings_ratio:.2f}

You're starting at Level 1 with 0 XP. Make wise financial decisions to progress!

What financial decision would you like to make first?"""

    return AbacusResponse(
        content=status_message,
        career_path=career_path,
        income=financial_data["income"],
        expenses=financial_data["expenses"],
        savings=financial_data["savings"],
        debt=financial_data["debt"],
        monthly_savings=monthly_savings,
        debt_to_income_ratio=debt_to_income_ratio,
        savings_ratio=savings_ratio,
        xp_earned=financial_data["xp_earned"],
        level=financial_data["level"],
        achievements=financial_data["achievements"]
    )

def process_financial_decisions_function(
    career_path: str,
    income: float,
    expenses: float,
    savings: float,
    debt: float,
    financial_decision: str,
    next_step: str
) -> AbacusResponse:
    """
    Process financial decisions and update player status
    
    Args:
        career_path: Selected career path
        income: Current monthly income
        expenses: Current monthly expenses
        savings: Current savings amount
        debt: Current debt amount
        financial_decision: Decision made by the player
        next_step: Continue or conclude the session
        
    Returns:
        AbacusResponse containing updated financial status and game progress
    """
    # Validate career path
    if career_path not in CAREER_PATHS:
        return AbacusResponse(
            content=f"Error: '{career_path}' is not a recognized career path.",
            error="Invalid career path"
        )
    
    # Convert decision to lowercase and replace spaces with underscores for lookup
    decision_key = financial_decision.lower().replace(" ", "_")
    
    # Prepare data for calculations
    data = {
        "income": income,
        "expenses": expenses,
        "savings": savings,
        "debt": debt,
        "xp_earned": 0,  # Will be updated based on decision
        "initial_income": CAREER_PATHS[career_path]["income"],
        "initial_expenses": CAREER_PATHS[career_path]["expenses"],
        "initial_savings": CAREER_PATHS[career_path]["savings"],
        "initial_debt": CAREER_PATHS[career_path]["debt"]
    }
    
    # Process decision
    decision_message = ""
    if decision_key in FINANCIAL_DECISIONS:
        # Apply decision effect
        decision_effect = FINANCIAL_DECISIONS[decision_key]["effect"](data)
        for key, value in decision_effect.items():
            if key != "message":
                data[key] = value
        
        decision_message = decision_effect.get("message", "Decision processed.")
    else:
        # Fallback for unrecognized decisions - balanced approach
        decision_effect = FINANCIAL_DECISIONS["balanced_approach"]["effect"](data)
        for key, value in decision_effect.items():
            if key != "message":
                data[key] = value
        
        decision_message = "I'm not sure about that specific decision, so I've applied a balanced approach between saving and debt reduction."
    
    # Random financial event
    event_message = None
    random_event = None
    
    # Generate a random number to determine if an event occurs
    if random.random() < 0.3:  # 30% chance of a random event
        # Select an event based on probabilities
        event_selection = random.random()
        cumulative_prob = 0
        
        for event in FINANCIAL_EVENTS:
            cumulative_prob += event["probability"]
            if event_selection <= cumulative_prob:
                random_event = event
                break
        
        if random_event:
            # Apply event effect
            event_effect = random_event["effect"](data)
            for key, value in event_effect.items():
                if key != "message":
                    data[key] = value
            
            event_message = f"Financial Event: {random_event['name']}\n\n{event_effect.get('message', '')}"
    
    # Check for achievements
    new_achievements = []
    for achievement in ACHIEVEMENTS:
        if achievement["condition"](data) and achievement["name"] not in data.get("achievements", []):
            new_achievements.append(achievement["name"])
            data["xp_earned"] += achievement["xp_bonus"]
    
    # Calculate new level
    new_level = get_level(data["xp_earned"])
    
    # Calculate updated metrics
    monthly_savings = data["income"] - data["expenses"]
    debt_to_income_ratio = data["debt"] / data["income"] if data["income"] > 0 else 0
    savings_ratio = data["savings"] / data["income"] if data["income"] > 0 else 0
    
    # Prepare message
    status_message = f"""Financial Decision Applied: {financial_decision}

{decision_message}

"""

    if event_message:
        status_message += f"{event_message}\n\n"
    
    if new_achievements:
        status_message += "🏆 Achievements Unlocked:\n"
        for achievement in new_achievements:
            matching_achievement = next((a for a in ACHIEVEMENTS if a["name"] == achievement), None)
            if matching_achievement:
                status_message += f"- {achievement}: {matching_achievement['description']}\n"
        status_message += "\n"
    
    status_message += f"""Updated Financial Status:

Monthly Income: £{data["income"]:,.2f}
Monthly Expenses: £{data["expenses"]:,.2f}
Current Savings: £{data["savings"]:,.2f}
Current Debt: £{data["debt"]:,.2f}

Monthly Net Cash Flow: £{monthly_savings:,.2f}
Debt-to-Income Ratio: {debt_to_income_ratio:.2f}
Savings as % of Income: {savings_ratio:.2f}

XP: {data["xp_earned"]} (Level {new_level})

What would you like to do next?"""

    # Get full list of achievements including previous ones
    all_achievements = data.get("achievements", []) + new_achievements
    
    return AbacusResponse(
        content=status_message,
        career_path=career_path,
        income=data["income"],
        expenses=data["expenses"],
        savings=data["savings"],
        debt=data["debt"],
        xp_earned=data["xp_earned"],
        level=new_level,
        achievements=all_achievements,
        crisis_event=random_event["name"] if random_event else None,
        monthly_savings=monthly_savings,
        debt_to_income_ratio=debt_to_income_ratio,
        savings_ratio=savings_ratio,
        next_step=next_step
    )

def conclude_session_function(
    player_name: str,
    career_path: str,
    xp_earned: int,
    level: int,
    achievements: List[str],
    financial_decision: str
) -> AbacusResponse:
    """
    Conclude the game session and provide summary
    
    Args:
        player_name: Player's name
        career_path: Selected career path
        xp_earned: Total XP earned
        level: Final level achieved
        achievements: List of achievements unlocked
        financial_decision: Last financial decision made
        
    Returns:
        AbacusResponse containing conclusion message and summary
    """
    # Calculate leaderboard position (simulated)
    leaderboard_position = max(1, 10 - level)
    
    # Final XP bonus based on career path difficulty
    career_difficulty_bonus = {
        "Student": 15,
        "Artist": 10,
        "Entrepreneur": 20,
        "Banker": 5
    }
    
    final_xp = xp_earned + career_difficulty_bonus.get(career_path, 0)
    final_level = get_level(final_xp)
    
    # Summary message
    summary_message = f"""Congratulations, {player_name}!

You've completed your Financial Twin simulation as a {career_path}.

Final Stats:
• XP: {final_xp} (Level {final_level})
• Career Path: {career_path}
• Achievements Unlocked: {len(achievements)}
• Leaderboard Position: #{leaderboard_position}

"""

    if achievements:
        summary_message += "🏆 Your Achievements:\n"
        for achievement in achievements:
            matching_achievement = next((a for a in ACHIEVEMENTS if a["name"] == achievement), None)
            if matching_achievement:
                summary_message += f"- {achievement}: {matching_achievement['description']}\n"
        summary_message += "\n"
    
    summary_message += """Key Financial Lessons:
• Consistent saving builds wealth over time
• Paying down high-interest debt is often a priority
• Emergency funds provide security in unexpected situations
• Budgeting helps you stay on track with your financial goals
• Financial freedom comes from regular, intentional money management

Thank you for playing Financial Twin! Apply these financial insights to your real-world finances."""

    return AbacusResponse(
        content=summary_message,
        player_name=player_name,
        career_path=career_path,
        final_xp=final_xp,
        final_level=final_level,
        final_achievements=achievements,
        leaderboard_position=leaderboard_position
    )

def run_game_function(function_name: str, params: Dict[str, Any]) -> str:
    """
    Run a specific game function with the provided parameters
    
    Args:
        function_name: Name of the function to run
        params: Dictionary of parameters for the function
        
    Returns:
        JSON string containing the function response
    """
    try:
        # Map function names to actual functions
        function_map = {
            "welcome_node_function": welcome_node_function,
            "initialize_financial_twin_function": initialize_financial_twin_function,
            "process_financial_decisions_function": process_financial_decisions_function,
            "conclude_session_function": conclude_session_function
        }
        
        # Check if function exists
        if function_name not in function_map:
            return json.dumps({
                "content": f"Error: Function '{function_name}' not found",
                "error": "Invalid function name"
            })
        
        # Call the appropriate function with parameters
        function = function_map[function_name]
        response = function(**params)
        
        # Return the response as JSON
        return json.dumps(response.to_dict())
        
    except Exception as e:
        # Handle any errors that occur during execution
        return json.dumps({
            "content": f"Error executing game function: {str(e)}",
            "error": str(e)
        })