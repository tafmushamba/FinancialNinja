"""
Financial Twin Simulation Game
This is the main module for the Financial Twin game, containing all the core game functions.
"""
import random
import json
from typing import Dict, Any, List, Optional

class AbacusResponse:
    """Simple response class to mimic the structure of API responses"""
    def __init__(self, content: str, **kwargs):
        self.content = content
        self.meta = kwargs
        
    def to_dict(self):
        """Convert the response to a dictionary for JSON serialization"""
        result = {
            "content": self.content,
            **self.meta
        }
        return result
    
    def to_json(self):
        """Convert the response to a JSON string"""
        return json.dumps(self.to_dict())

def get_level(xp: int) -> int:
    """Calculate level based on XP earned"""
    if xp < 100:
        return 1
    elif xp < 300:
        return 2
    elif xp < 600:
        return 3
    elif xp < 1000:
        return 4
    else:
        return 5

def welcome_node_function(player_name: str, career_choice: str) -> AbacusResponse:
    """
    Welcome function for new players starting the game
    
    Args:
        player_name: Player's name
        career_choice: Selected career path (Student, Entrepreneur, Artist, Banker)
        
    Returns:
        AbacusResponse containing welcome message and data
    """
    career_paths = {
        "Student": {
            "income": 800,
            "expenses": 700,
            "savings": 200,
            "debt": 5000  # Student loan
        },
        "Entrepreneur": {
            "income": 1200,
            "expenses": 1000,
            "savings": 500,
            "debt": 2000  # Initial business loan
        },
        "Artist": {
            "income": 900,
            "expenses": 800,
            "savings": 300,
            "debt": 1000  # Art supplies credit
        },
        "Banker": {
            "income": 2500,
            "expenses": 2000,
            "savings": 1000,
            "debt": 8000  # Mortgage or car loan
        }
    }
    
    path_data = career_paths.get(career_choice, career_paths["Student"])
    
    welcome_message = f"""
Welcome to Financial Twin, {player_name}!

You've chosen the {career_choice} career path. Let's see what financial future awaits you!

Initial financial status:
- Monthly Income: £{path_data['income']}
- Monthly Expenses: £{path_data['expenses']}
- Savings: £{path_data['savings']}
- Debt: £{path_data['debt']}

Are you ready to make your first financial decisions?
"""
    
    return AbacusResponse(
        welcome_message,
        career_path=career_choice,
        income=path_data['income'],
        expenses=path_data['expenses'],
        savings=path_data['savings'],
        debt=path_data['debt'],
        xp_earned=0,
        level=1,
        achievements=[]
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
    career_paths = {
        "Student": {
            "income": 800,
            "expenses": 700,
            "savings": 200,
            "debt": 5000,
            "decisions": [
                "Take a part-time job to increase income",
                "Apply for a scholarship to reduce debt",
                "Cut living expenses by moving to cheaper accommodation",
                "Invest a small amount in a high-risk stock"
            ]
        },
        "Entrepreneur": {
            "income": 1200,
            "expenses": 1000,
            "savings": 500,
            "debt": 2000,
            "decisions": [
                "Invest in marketing to increase business income",
                "Cut business expenses by working from home",
                "Take a small loan to expand operations",
                "Focus on networking to find new clients"
            ]
        },
        "Artist": {
            "income": 900,
            "expenses": 800,
            "savings": 300,
            "debt": 1000,
            "decisions": [
                "Create an online store to sell art",
                "Apply for an arts grant",
                "Teach art classes for additional income",
                "Collaborate with other artists to share expenses"
            ]
        },
        "Banker": {
            "income": 2500,
            "expenses": 2000,
            "savings": 1000,
            "debt": 8000,
            "decisions": [
                "Invest in a diversified portfolio",
                "Refinance loans to lower interest rates",
                "Take professional development courses",
                "Start a side hustle in financial consulting"
            ]
        }
    }
    
    path_data = career_paths.get(career_path, career_paths["Student"])
    
    # Calculate financial health metrics
    monthly_balance = path_data['income'] - path_data['expenses']
    debt_to_income_ratio = path_data['debt'] / (path_data['income'] * 12) * 100
    savings_ratio = path_data['savings'] / path_data['income'] * 100
    
    # Random initial financial event
    events = [
        "You've received a surprise £200 cashback from your credit card!",
        "Unexpected car repairs cost you £150.",
        "A family member gifted you £100 for your birthday.",
        "Your utility bills were higher than expected this month (-£80).",
        None  # No event
    ]
    
    crisis_event = random.choice(events)
    
    # Initialize with some XP based on acknowledgment
    xp_earned = 10 if "understand" in acknowledge_status.lower() else 5
    
    message = f"""
Your financial twin is now initialized! As a {career_path}, you have:

Monthly Income: £{path_data['income']}
Monthly Expenses: £{path_data['expenses']}
Monthly Balance: £{monthly_balance}
Current Savings: £{path_data['savings']}
Current Debt: £{path_data['debt']}

Your financial health indicators:
- Debt-to-Income Ratio: {debt_to_income_ratio:.1f}%
- Savings Ratio: {savings_ratio:.1f}%

{crisis_event if crisis_event else ""}

What financial decision would you like to make? You can:
- {path_data['decisions'][0]}
- {path_data['decisions'][1]}
- {path_data['decisions'][2]}
- {path_data['decisions'][3]}
"""
    
    # Apply event impact if any
    savings = path_data['savings']
    if crisis_event:
        if "cashback" in crisis_event:
            savings += 200
        elif "car repairs" in crisis_event:
            savings -= 150
        elif "gifted" in crisis_event:
            savings += 100
        elif "bills" in crisis_event:
            savings -= 80
    
    return AbacusResponse(
        message,
        career_path=career_path,
        income=path_data['income'],
        expenses=path_data['expenses'],
        savings=savings,
        debt=path_data['debt'],
        xp_earned=xp_earned,
        level=get_level(xp_earned),
        achievements=["Started Financial Journey"],
        crisis_event=crisis_event,
        monthly_savings=monthly_balance,
        debt_to_income_ratio=debt_to_income_ratio,
        savings_ratio=savings_ratio,
        next_step="continue"
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
    # Prepare career-specific decision outcomes
    career_decisions = {
        "Student": {
            "Take a part-time job": {
                "income_change": 200,
                "expenses_change": 50,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 30,
                "message": "You found a part-time job that pays £200 extra per month. Your expenses increased slightly due to commuting costs.",
                "achievement": "Income Booster"
            },
            "Apply for a scholarship": {
                "income_change": 0,
                "expenses_change": 0,
                "savings_change": 50,
                "debt_change": -1000,
                "xp_earned": 40,
                "message": "You were awarded a partial scholarship! Your debt has been reduced by £1,000 and you received a £50 book stipend.",
                "achievement": "Debt Reducer"
            },
            "Cut living expenses": {
                "income_change": 0,
                "expenses_change": -150,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 25,
                "message": "You moved to a shared flat and reduced your monthly expenses by £150.",
                "achievement": "Frugal Living"
            },
            "Invest in stocks": {
                "income_change": 0,
                "expenses_change": 0,
                "savings_change": random.choice([-50, 100]),
                "debt_change": 0,
                "xp_earned": 20,
                "message": "Your stock investment {result}.",
                "achievement": "First Investor"
            }
        },
        "Entrepreneur": {
            "Invest in marketing": {
                "income_change": 300,
                "expenses_change": 100,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 35,
                "message": "Your marketing campaign was a success! Monthly income increased by £300, with ongoing costs of £100.",
                "achievement": "Marketing Guru"
            },
            "Cut business expenses": {
                "income_change": 0,
                "expenses_change": -200,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 30,
                "message": "Working from home saved you £200 in monthly expenses.",
                "achievement": "Cost Cutter"
            },
            "Take a small loan": {
                "income_change": 400,
                "expenses_change": 50,
                "savings_change": 0,
                "debt_change": 1000,
                "xp_earned": 25,
                "message": "You secured a £1,000 business loan and used it to generate £400 extra monthly income, with £50 in loan payments.",
                "achievement": "Business Expander"
            },
            "Focus on networking": {
                "income_change": random.choice([0, 250]),
                "expenses_change": 50,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 20,
                "message": "Your networking efforts {result}, with £50 spent on events and coffees.",
                "achievement": "Networker"
            }
        },
        "Artist": {
            "Create an online store": {
                "income_change": 200,
                "expenses_change": 50,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 30,
                "message": "Your online store is generating £200 extra per month, with £50 in platform fees.",
                "achievement": "Digital Entrepreneur"
            },
            "Apply for an arts grant": {
                "income_change": random.choice([0, 500]),
                "expenses_change": 0,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 25,
                "message": "Your grant application {result}.",
                "achievement": "Grant Winner"
            },
            "Teach art classes": {
                "income_change": 300,
                "expenses_change": 75,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 35,
                "message": "Your art classes bring in £300 extra per month, with £75 in materials and space rental.",
                "achievement": "Art Educator"
            },
            "Collaborate with artists": {
                "income_change": 150,
                "expenses_change": -100,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 30,
                "message": "Your collaboration reduced expenses by £100 and added £150 to your monthly income through joint projects.",
                "achievement": "Collaborator"
            }
        },
        "Banker": {
            "Invest in a portfolio": {
                "income_change": 150,
                "expenses_change": 0,
                "savings_change": -1000,
                "debt_change": 0,
                "xp_earned": 40,
                "message": "You invested £1,000 from savings into a portfolio generating £150 monthly returns.",
                "achievement": "Portfolio Manager"
            },
            "Refinance loans": {
                "income_change": 0,
                "expenses_change": -100,
                "savings_change": 0,
                "debt_change": -500,
                "xp_earned": 35,
                "message": "Refinancing reduced your debt by £500 and monthly expenses by £100.",
                "achievement": "Smart Borrower"
            },
            "Take professional courses": {
                "income_change": 300,
                "expenses_change": 50,
                "savings_change": -400,
                "debt_change": 0,
                "xp_earned": 30,
                "message": "Your new certification cost £400 but increased your income by £300 per month, with ongoing professional fees of £50.",
                "achievement": "Continuous Learner"
            },
            "Start a side hustle": {
                "income_change": 400,
                "expenses_change": 100,
                "savings_change": 0,
                "debt_change": 0,
                "xp_earned": 35,
                "message": "Your financial consulting side hustle brings in £400 extra income with £100 in expenses.",
                "achievement": "Side Hustler"
            }
        }
    }
    
    # Find the matching decision based on keywords
    decision_effect = None
    chosen_key = None
    achievements = []
    
    if career_path in career_decisions:
        career_options = career_decisions[career_path]
        
        for decision_key, effect in career_options.items():
            if decision_key.lower() in financial_decision.lower():
                decision_effect = effect
                chosen_key = decision_key
                break
    
    # Default decision if no match found
    if not decision_effect:
        decision_effect = {
            "income_change": 0,
            "expenses_change": 0,
            "savings_change": 0,
            "debt_change": 0,
            "xp_earned": 10,
            "message": "Your decision had minimal financial impact.",
            "achievement": None
        }
    
    # Apply the decision effects
    new_income = income + decision_effect["income_change"]
    new_expenses = expenses + decision_effect["expenses_change"]
    new_savings = savings + decision_effect["savings_change"] + (new_income - new_expenses)
    new_debt = debt + decision_effect["debt_change"]
    
    # Format message with result for random outcomes
    message = decision_effect["message"]
    if "result" in message:
        if "stocks" in financial_decision.lower():
            result = "resulted in a profit" if decision_effect["savings_change"] > 0 else "resulted in a small loss"
            message = message.format(result=result)
        elif "networking" in financial_decision.lower():
            result = "brought in new clients worth £250" if decision_effect["income_change"] > 0 else "haven't paid off financially yet"
            message = message.format(result=result)
        elif "grant" in financial_decision.lower():
            result = "was successful! You received a £500 monthly stipend" if decision_effect["income_change"] > 0 else "was unsuccessful this time"
            message = message.format(result=result)
    
    # Calculate financial health metrics
    monthly_balance = new_income - new_expenses
    debt_to_income_ratio = new_debt / (new_income * 12) * 100 if new_income > 0 else 0
    savings_ratio = new_savings / new_income * 100 if new_income > 0 else 0
    
    # Add achievements
    if decision_effect["achievement"]:
        achievements.append(decision_effect["achievement"])
    
    # Add milestone achievements
    if new_income >= 1500 and income < 1500:
        achievements.append("Income Milestone: £1,500")
    
    if new_savings >= 1000 and savings < 1000:
        achievements.append("Savings Milestone: £1,000")
    
    if new_debt <= 0 and debt > 0:
        achievements.append("Debt Freedom")
    
    # Random events that might occur
    random_events = [
        {"event": "Your emergency fund came in handy when your laptop needed repairs. (-£200)", "savings": -200},
        {"event": "You received a tax refund! (+£150)", "savings": 150},
        {"event": "A friend paid back a loan you had forgotten about. (+£100)", "savings": 100},
        {"event": "An unexpected medical expense came up. (-£250)", "savings": -250},
        {"event": "You won a small prize in a local contest! (+£50)", "savings": 50},
    ]
    
    # 30% chance of a random event
    crisis_event = None
    if random.random() < 0.3:
        event = random.choice(random_events)
        crisis_event = event["event"]
        new_savings += event["savings"]
    
    # Prepare next options based on career
    next_options = []
    if career_path == "Student":
        next_options = [
            "Look for higher-paying work opportunities",
            "Apply for additional financial aid",
            "Start a small side hustle",
            "Create a stricter budget"
        ]
    elif career_path == "Entrepreneur":
        next_options = [
            "Explore new product/service offerings",
            "Seek angel investment",
            "Optimize pricing strategy",
            "Expand to new markets"
        ]
    elif career_path == "Artist":
        next_options = [
            "Participate in a high-profile exhibition",
            "Launch a crowdfunding campaign",
            "Create a subscription service for fans",
            "Partner with local businesses"
        ]
    elif career_path == "Banker":
        next_options = [
            "Negotiate a salary increase",
            "Maximize employer benefits",
            "Start a passive income stream",
            "Optimize tax strategies"
        ]
    
    # Generate response message
    response_message = f"""
{message}

Your updated financial status:
Monthly Income: £{new_income}
Monthly Expenses: £{new_expenses}
Monthly Balance: £{monthly_balance}
Current Savings: £{new_savings}
Current Debt: £{new_debt}

Your financial health indicators:
- Debt-to-Income Ratio: {debt_to_income_ratio:.1f}%
- Savings Ratio: {savings_ratio:.1f}%

{crisis_event if crisis_event else ""}

"""
    
    if next_step.lower() == "continue":
        response_message += """
What's your next financial move? You can:
- {}
- {}
- {}
- {}
""".format(*next_options)
    else:
        response_message += "\nYou've decided to conclude this financial simulation session."
    
    # Calculate total XP
    current_xp = decision_effect["xp_earned"]
    if new_savings > savings:
        current_xp += 5
    if new_debt < debt:
        current_xp += 5
    if monthly_balance > 0:
        current_xp += 5
    
    return AbacusResponse(
        response_message,
        career_path=career_path,
        income=new_income,
        expenses=new_expenses,
        savings=new_savings,
        debt=new_debt,
        xp_earned=current_xp,
        level=get_level(current_xp),
        achievements=achievements,
        crisis_event=crisis_event,
        monthly_savings=monthly_balance,
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
    # Calculate final stats
    final_xp = xp_earned + 50  # Bonus for completing a session
    final_level = get_level(final_xp)
    
    # Add conclusion achievements
    final_achievements = achievements if isinstance(achievements, list) else []
    final_achievements.append("Session Completed")
    
    if final_level > level:
        final_achievements.append(f"Reached Level {final_level}")
    
    # Create personalized advice based on career path
    career_advice = {
        "Student": "Focus on balancing study with part-time work, and prioritize paying down student loans early.",
        "Entrepreneur": "Build an emergency fund of 6-12 months' expenses to weather business volatility.",
        "Artist": "Diversify your income sources and gradually build passive income streams from your creative work.",
        "Banker": "Leverage your financial knowledge to optimize investments and create multiple income sources."
    }
    
    advice = career_advice.get(career_path, "Continue building your financial knowledge and apply it consistently.")
    
    # Generate conclusion message
    conclusion_message = f"""
Congratulations on completing your Financial Twin simulation, {player_name}!

As a {career_path}, you've made several key financial decisions, including {financial_decision} most recently.

Your achievements:
- {", ".join(final_achievements)}

You earned {final_xp} XP and reached Level {final_level}!

Financial advice tailored for you:
{advice}

Key takeaways:
1. Regular financial decisions compound over time
2. Building emergency savings provides security during unexpected events
3. Financial education leads to better decision-making
4. Your career path offers unique financial opportunities and challenges

Thank you for using Financial Twin! Continue your journey to financial literacy with our other learning modules.
"""
    
    # Randomly assign a leaderboard position for fun
    leaderboard_position = random.randint(1, 50)
    
    return AbacusResponse(
        conclusion_message,
        career_path=career_path,
        final_xp=final_xp,
        final_level=final_level,
        final_achievements=final_achievements,
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
        if function_name == "welcome_node_function":
            player_name = params.get("player_name", "Player")
            career_choice = params.get("career_choice", "Student")
            response = welcome_node_function(player_name, career_choice)
            
        elif function_name == "initialize_financial_twin_function":
            career_path = params.get("career_path", "Student")
            acknowledge_status = params.get("acknowledge_status", "I understand")
            response = initialize_financial_twin_function(career_path, acknowledge_status)
            
        elif function_name == "process_financial_decisions_function":
            career_path = params.get("career_path", "Student")
            income = float(params.get("income", 800))
            expenses = float(params.get("expenses", 700))
            savings = float(params.get("savings", 200))
            debt = float(params.get("debt", 5000))
            financial_decision = params.get("financial_decision", "Save more money")
            next_step = params.get("next_step", "continue")
            response = process_financial_decisions_function(
                career_path, income, expenses, savings, debt, financial_decision, next_step
            )
            
        elif function_name == "conclude_session_function":
            player_name = params.get("player_name", "Player")
            career_path = params.get("career_path", "Student")
            xp_earned = int(params.get("xp_earned", 0))
            level = int(params.get("level", 1))
            achievements = params.get("achievements", [])
            financial_decision = params.get("financial_decision", "No decision")
            response = conclude_session_function(
                player_name, career_path, xp_earned, level, achievements, financial_decision
            )
            
        else:
            response = AbacusResponse(
                "Error: Unknown function",
                error="Function not found"
            )
    except Exception as e:
        response = AbacusResponse(
            f"Error executing function: {str(e)}",
            error=str(e)
        )
    
    return json.dumps(response.to_dict())