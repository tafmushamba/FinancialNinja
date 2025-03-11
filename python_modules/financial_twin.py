"""
Financial Twin Simulation Game
This is the main module for the Financial Twin game, containing all the core game functions.
"""
import random
import json
import math
import sys
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

# Add the project root to the Python path to support both direct and relative imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup module imports that can work both when imported directly or as part of a package
try:
    from python_modules.abacusai import AgentResponse, ApiClient
except ImportError:
    from abacusai import AgentResponse, ApiClient

class AbacusResponse:
    """Simple response class to mimic the structure of API responses"""
    def __init__(self, content: str, **kwargs):
        self.content = content
        self.data = kwargs
    
    def to_dict(self):
        """Convert the response to a dictionary for JSON serialization"""
        result = {"content": self.content}
        result.update(self.data)
        return result
    
    def to_json(self):
        """Convert the response to a JSON string"""
        return json.dumps(self.to_dict())

def get_level(xp: int) -> int:
    """Calculate level based on XP earned"""
    return math.floor(xp / 100) + 1

def welcome_node_function(player_name: str, career_choice: str) -> AbacusResponse:
    """
    Welcome function for new players starting the game
    
    Args:
        player_name: Player's name
        career_choice: Selected career path (Student, Entrepreneur, Artist, Banker)
        
    Returns:
        AbacusResponse containing welcome message and data
    """
    # ApiClient is already imported at the top of the file
    client = ApiClient()
    prompt = f'''You are a friendly game host. A new player named {player_name} has joined the game.

Introduce the player to the Interactive Financial Simulation Game where they will create a virtual financial twin and navigate through life's financial challenges.

Explain that they can choose from one of the following career paths, each with unique financial challenges and story-driven missions:

1. Student
2. Entrepreneur
3. Artist
4. Banker

They have chosen the career path: {career_choice.title() if hasattr(career_choice, "title") else career_choice}.

Provide an enthusiastic welcome message that acknowledges their choice and sets the stage for their journey as a {career_choice.title() if hasattr(career_choice, "title") else career_choice}.
'''
    response = client.evaluate_prompt(prompt=prompt, system_message='As a game host, generate a welcoming message for the player. Be friendly, engaging, and set a positive tone for the game.').content
    return AbacusResponse(response, career_path=career_choice)

def initialize_financial_twin_function(career_path: str, acknowledge_status: str) -> AbacusResponse:
    """
    Initialize the financial data for the selected career path
    
    Args:
        career_path: Selected career path
        acknowledge_status: Acknowledgment of initial financial status
        
    Returns:
        AbacusResponse containing initial status and financial data plus decision options
    """
    # ApiClient is already imported at the top of the file
    client = ApiClient()
    
    # Define initial financial values for each career path (in GBP £)
    career_data = {
        'Student': {'income': 900.0, 'expenses': 850.0, 'savings': 400.0, 'debt': 15000.0},
        'Entrepreneur': {'income': 2500.0, 'expenses': 2000.0, 'savings': 8000.0, 'debt': 40000.0},
        'Artist': {'income': 1700.0, 'expenses': 1500.0, 'savings': 1500.0, 'debt': 12000.0},
        'Banker': {'income': 5500.0, 'expenses': 4000.0, 'savings': 25000.0, 'debt': 8000.0}
    }
    
    # UK-specific initial decision options for each career path
    career_decisions = {
        'Student': [
            {
                'value': 'budget_tightly',
                'label': 'Budget Tightly',
                'description': 'Cut all non-essential spending to maximize savings',
                'impact': {'savings': 15, 'debt': 0, 'income': 0, 'expenses': -20}
            },
            {
                'value': 'find_part_time_job',
                'label': 'Find Part-Time Job',
                'description': 'Look for work in a pub or shop to supplement your maintenance loan',
                'impact': {'savings': 5, 'debt': 0, 'income': 25, 'expenses': 5}
            },
            {
                'value': 'student_discount_focus',
                'label': 'Maximise Student Discounts',
                'description': 'Sign up for TOTUM card and student offers',
                'impact': {'savings': 5, 'debt': 0, 'income': 0, 'expenses': -10}
            },
            {
                'value': 'loan_repayment_planning',
                'label': 'Student Loan Planning',
                'description': 'Understand repayment thresholds and plan your finances',
                'impact': {'savings': 0, 'debt': -5, 'income': 0, 'expenses': 0}
            }
        ],
        'Entrepreneur': [
            {
                'value': 'bootstrap_business',
                'label': 'Bootstrap Your Business',
                'description': 'Minimize expenses and grow slowly without external funding',
                'impact': {'savings': -5, 'debt': 0, 'income': 10, 'expenses': -15}
            },
            {
                'value': 'seek_angel_investment',
                'label': 'Seek Angel Investment',
                'description': 'Pitch to UK angel investors for early funding',
                'impact': {'savings': 30, 'debt': 0, 'income': 20, 'expenses': 15}
            },
            {
                'value': 'apply_startup_loan',
                'label': 'Apply for Start Up Loan',
                'description': 'Apply for a UK government-backed Start Up Loan',
                'impact': {'savings': 25, 'debt': 20, 'income': 15, 'expenses': 10}
            },
            {
                'value': 'revenue_focus',
                'label': 'Focus on Early Revenue',
                'description': 'Prioritize paying customers and positive cash flow',
                'impact': {'savings': 10, 'debt': -5, 'income': 15, 'expenses': 0}
            }
        ],
        'Artist': [
            {
                'value': 'arts_council_grant',
                'label': 'Apply for Arts Council Grant',
                'description': 'Seek funding from Arts Council England',
                'impact': {'savings': 20, 'debt': 0, 'income': 15, 'expenses': 5}
            },
            {
                'value': 'teaching_workshops',
                'label': 'Teach Art Workshops',
                'description': 'Supplement income by teaching your skills',
                'impact': {'savings': 5, 'debt': 0, 'income': 20, 'expenses': 3}
            },
            {
                'value': 'digital_platforms',
                'label': 'Sell on Digital Platforms',
                'description': 'Use UK platforms like Etsy and Not On The High Street',
                'impact': {'savings': 8, 'debt': 0, 'income': 12, 'expenses': 5}
            },
            {
                'value': 'shared_studio_space',
                'label': 'Join Shared Studio',
                'description': 'Share studio costs with other artists',
                'impact': {'savings': 5, 'debt': 0, 'income': 0, 'expenses': -15}
            }
        ],
        'Banker': [
            {
                'value': 'maximise_pension',
                'label': 'Maximise Pension Contributions',
                'description': 'Take advantage of tax relief and employer matching',
                'impact': {'savings': 25, 'debt': 0, 'income': -5, 'expenses': 0}
            },
            {
                'value': 'invest_isa',
                'label': 'Invest in Stocks & Shares ISA',
                'description': 'Use your annual ISA allowance for tax-efficient investing',
                'impact': {'savings': -10, 'debt': 0, 'income': 8, 'expenses': 0}
            },
            {
                'value': 'property_investment',
                'label': 'UK Property Investment',
                'description': 'Invest in the British property market',
                'impact': {'savings': -30, 'debt': 20, 'income': 15, 'expenses': 10}
            },
            {
                'value': 'professional_development',
                'label': 'Professional Qualifications',
                'description': 'Invest in CFA or other financial certifications',
                'impact': {'savings': -15, 'debt': 0, 'income': 25, 'expenses': 5}
            }
        ]
    }
    
    # Use the career data or default values if career not found
    financial_status = career_data.get(str(career_path), {'income': 0.0, 'expenses': 0.0, 'savings': 0.0, 'debt': 0.0})
    income = financial_status['income']
    expenses = financial_status['expenses']
    savings = financial_status['savings']
    debt = financial_status['debt']
    
    # Get decision options for this career path
    decision_options = career_decisions.get(str(career_path), [])
    
    # Create prompt for the AI
    prompt = f'''
You are a financial game host for UK players. A player has chosen the career path of {career_path}.

Their initial financial status is:
- Monthly Income: £{income} per month
- Monthly Expenses: £{expenses} per month
- Savings: £{savings}
- Debt: £{debt}

Present this initial financial status to the player, providing a clear breakdown using British pounds (£).

Then, introduce the first financial challenge or story mission relevant to the chosen career path. The challenge should be specific to the UK context and appropriate for a {career_path}.

Use examples that are relevant to the UK financial system (ISAs, Help to Buy, NS&I, UK tax bands, etc.) and British life scenarios rather than American ones.

Ask the player to make decisions regarding financial choices, such as budgeting, investing, paying off debt, or making purchases. Present specific UK-relevant options for them to choose from.

Use an engaging and motivating tone.
'''
    system_message = 'As a friendly financial game host, generate an engaging message for a UK player, presenting their initial financial status in British pounds (£), introducing the first financial challenge with UK-specific context, and asking them to make decisions. Keep the message under 500 words.'
    response = client.evaluate_prompt(prompt=prompt, system_message=system_message).content
    
    # Return response with initial financial data and decision options
    return AbacusResponse(response, 
                         income=income, 
                         expenses=expenses, 
                         savings=savings, 
                         debt=debt, 
                         career_path=career_path,
                         xp_earned=0,
                         level=1,
                         achievements=[],
                         decision_options=decision_options)

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
    # ApiClient is already imported at the top of the file
    # random and math are already imported at the top
    
    client = ApiClient()
    
    # Convert inputs to appropriate types if they're strings
    try:
        income = float(income)
        expenses = float(expenses)
        savings = float(savings)
        debt = float(debt)
    except (ValueError, TypeError):
        # If conversion fails, use default values
        income = 2000.0
        expenses = 1500.0
        savings = 1000.0
        debt = 10000.0
    
    # UK-specific scenario database for different career paths
    scenarios = {
        'Student': [
            "Your student maintenance loan payment from Student Finance England is due soon, but your expenses are higher than expected. How will you manage your finances?",
            "The new term is starting at uni, and you need to purchase textbooks. You can buy new, get used ones from the SU shop, or find digital versions. What's your plan?",
            "Your laptop needs replacing before assignment deadlines. You could use your overdraft, ask parents for help, or use the uni computer labs. What will you do?",
            "Your flatmates are planning a holiday to Spain during reading week. It would cost £450 but could be a great experience. How do you handle this?",
            "You've received a £300 bursary from your university. Will you save it in your ISA, use it for everyday expenses, or invest in a professional development course?"
        ],
        'Entrepreneur': [
            "A potential angel investor from London Tech Angels is interested in your startup. They offer £50,000 funding but want 25% equity. What's your decision?",
            "Your business is growing and you're stretched thin. You can hire a part-time assistant for £1,200/month or work longer hours yourself. What will you do?",
            "A competitor in your industry is closing down and offers to sell their client list for £5,000. It could bring in new business but is pricey. What's your choice?",
            "You have £8,000 to invest in your business. You can either upgrade your equipment or invest in digital marketing with a London agency. Which path do you choose?",
            "There's an opportunity to expand your business to Manchester, but it requires £15,000 upfront for a new location. How do you proceed?"
        ],
        'Artist': [
            "A popular gallery in Bristol offers to showcase your work, but you need to pay £600 for the space upfront. Is this a worthwhile investment?",
            "You need supplies for your next project. You can invest £400 in premium materials or £150 in basic supplies. What's your approach?",
            "A prestigious client offers a rush commission that pays £1,200, but you'll need to cancel other commitments worth £800. What do you do?",
            "The Royal College of Art is offering a specialized workshop that could enhance your skills, but it costs £850. How do you handle this opportunity?",
            "Not On The High Street wants to feature your work on their platform but takes a 35% commission. Will you join their marketplace?"
        ],
        'Banker': [
            "Your company offers share options as part of your bonus package. Will you exercise them (worth potentially £8,000) or take the cash equivalent of £5,500?",
            "You've spotted a promising investment opportunity in UK tech stocks, but it's relatively high-risk. Will you invest £10,000 from your portfolio?",
            "A Chartered Financial Analyst qualification could advance your career but costs £5,000 and requires significant study time. Is this the right move?",
            "You have £20,000 to invest. You can choose between a safe FTSE tracker fund or active management with higher potential returns. What's your strategy?",
            "A fintech startup approaches you to become an early investor with £15,000 for a 3% stake. How do you respond to this opportunity?"
        ]
    }
    
    # Calculate financial metrics
    monthly_savings = income - expenses
    debt_to_income_ratio = (debt / (income * 12)) if income > 0 else float('inf')
    savings_ratio = (savings / income) if income > 0 else 0
    
    # Check for achievements
    achievements = []
    if monthly_savings > 0:
        achievements.append('Positive Cash Flow Master')
    if savings_ratio > 0.2:
        achievements.append('Strategic Saver')
    if debt_to_income_ratio < 0.3:
        achievements.append('Debt Management Expert')
    if savings > 50000:
        achievements.append('Wealth Builder')
    if debt == 0:
        achievements.append('Debt Free Champion')
    
    # Calculate XP
    xp_earned = 50
    if monthly_savings > 0:
        xp_earned += 25
    if len(achievements) > 0:
        xp_earned += 25 * len(achievements)
    
    # Calculate level
    level = math.floor(xp_earned / 100) + 1
    
    # Process financial decision
    decision_lower = str(financial_decision).lower()
    if 'invest' in decision_lower:
        savings -= 1000
        if random.random() < 0.7:
            income += 200
    elif 'save' in decision_lower:
        savings += 500
        achievements.append('Savings Milestone')
    elif 'pay' in decision_lower and 'debt' in decision_lower:
        debt_payment = min(2000, debt)
        debt -= debt_payment
        savings -= debt_payment
    
    # Random UK-specific crisis event (20% chance)
    crisis_event = None
    if random.random() < 0.2:
        crisis_events = {
            'NHS Dental Treatment': {'cost': 280, 'message': 'You needed unexpected dental work not fully covered by the NHS.'},
            'Zero Hours Contract': {'income_reduction': 0.25, 'message': 'Your hours were cut on your zero-hours contract.'},
            'Boiler Breakdown': {'cost': 850, 'message': 'Your home boiler broke down and needed emergency repairs.'},
            'Council Tax Arrears': {'cost': 450, 'message': 'You received a notice for council tax arrears that must be paid.'},
            'Train Fare Increase': {'cost': 200, 'message': 'Your monthly rail commuting costs increased unexpectedly.'},
            'Letting Agency Fees': {'cost': 300, 'message': 'You faced unexpected letting agency fees during a house move.'}
        }
        crisis_type = random.choice(list(crisis_events.keys()))
        crisis = crisis_events[crisis_type]
        crisis_event = crisis['message']
        
        if 'cost' in crisis:
            savings -= crisis['cost']
        if 'income_reduction' in crisis:
            income *= (1 - crisis['income_reduction'])
    
    # Choose next scenario
    career_path_str = str(career_path)
    career_scenarios = scenarios.get(career_path_str, scenarios['Student'])
    next_scenario = random.choice(career_scenarios)
    
    # Create response message with British pounds
    response = f'''🎮 **Financial Twin Simulation Update** 🎮

💫 **Current Status:**
Level: {level} (XP: {xp_earned})
🏆 Achievements: {', '.join(achievements)}

💰 **Financial Metrics:**
Monthly Income: £{income:,.2f}
Monthly Expenses: £{expenses:,.2f}
Savings: £{savings:,.2f}
Debt: £{debt:,.2f}
Monthly Savings: £{monthly_savings:,.2f}
Debt-to-Income Ratio: {debt_to_income_ratio:.2%}
Savings Ratio: {savings_ratio:.2%}

✨ **Decision Impact:**
Your choice to {financial_decision} has been processed.
'''
    
    if crisis_event:
        response += f'''
⚠️ **Crisis Event:**
{crisis_event}
'''
    
    if next_step == 'continue':
        response += f'''
🎯 **Next Scenario:**
{next_scenario}

What's your decision?'''
    else:
        response += "\n🏁 **Session Complete!**\nLet's see your final summary..."
    
    return AbacusResponse(
        response,
        xp_earned=xp_earned,
        level=level,
        achievements=achievements,
        crisis_event=crisis_event,
        monthly_savings=monthly_savings,
        debt_to_income_ratio=debt_to_income_ratio,
        savings_ratio=savings_ratio,
        next_step=next_step,
        income=income,
        expenses=expenses,
        savings=savings,
        debt=debt
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
    # ApiClient is already imported at the top of the file
    client = ApiClient()
    
    # Convert to appropriate types if needed
    try:
        xp_earned = int(xp_earned)
        level = int(level)
        if isinstance(achievements, str):
            achievements = [achievements]
    except (ValueError, TypeError):
        xp_earned = 100
        level = 2
        achievements = []
    
    # Create leaderboard data
    leaderboard = [
        {'player_name': 'Alice', 'xp': 1200},
        {'player_name': 'Bob', 'xp': 1100},
        {'player_name': player_name, 'xp': xp_earned},
        {'player_name': 'Charlie', 'xp': 900}
    ]
    leaderboard.sort(key=lambda x: x['xp'], reverse=True)
    
    leaderboard_text = 'Current Leaderboard:\n'
    for rank, player in enumerate(leaderboard, start=1):
        leaderboard_text += f"{rank}. {player['player_name']} - XP: {player['xp']}\n"
    
    # Financial insights
    financial_insights = f'''You made the following financial decision during the simulation:
- {financial_decision}
'''
    
    # Create prompt for AI to generate conclusion
    prompt = f'''
As the game host, conclude the simulation session for player {player_name}.

Provide a summary of their financial performance:
- Career Path: {career_path}
- Total XP Earned: {xp_earned}
- Level Achieved: {level}
- Achievements Unlocked: {', '.join(achievements) if achievements else 'None'}

Provide data-driven insights on their spending patterns and financial decisions:
{financial_insights}

Update and display the leaderboards:
{leaderboard_text}

Thank the player for participating and encourage them to return for more gamified financial learning experiences.
'''
    
    system_message = "As a friendly game host, provide a concluding message that summarizes the player's performance, offers insights, displays the leaderboard, and encourages them to return."
    
    response = client.evaluate_prompt(prompt=prompt, system_message=system_message).content
    
    # Calculate final values
    final_xp = xp_earned + 100  # Bonus for completing session
    final_level = get_level(final_xp)
    final_achievements = achievements.copy()
    final_achievements.append("Game Completion")
    
    # Add conclusion message
    conclusion_message = f"""{response}

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