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
    
    # Create prompt for the AI with specific decision options
    # Format the decision options for the prompt
    formatted_options = ""
    for option in decision_options:
        formatted_options += f"- {option['label']}: {option['description']}\n"
    
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

When presenting the financial challenge, ask the player to choose from ONLY the following options:
{formatted_options}

IMPORTANT: The scenario must relate directly to these exact options. Do not reference any other choices that aren't listed above. Ensure your challenge scenario logically connects to these specific options.

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
    
    # UK-specific scenarios with scenario-specific decision options
    scenarios_with_options = {
        'Student': [
            {
                'scenario': "Your student maintenance loan payment from Student Finance England is due soon, but your expenses are higher than expected. How will you manage your finances?",
                'options': [
                    {
                        'value': 'budget_review',
                        'label': 'Review Your Budget',
                        'description': 'Analyze your spending and cut non-essentials',
                        'impact': {'savings': 10, 'debt': 0, 'income': 0, 'expenses': -15}
                    },
                    {
                        'value': 'hardship_fund',
                        'label': 'Apply for Hardship Fund',
                        'description': 'Contact your university\'s financial support team',
                        'impact': {'savings': 20, 'debt': 0, 'income': 15, 'expenses': 0}
                    },
                    {
                        'value': 'overdraft_extension',
                        'label': 'Use Student Overdraft',
                        'description': 'Extend your interest-free student overdraft temporarily',
                        'impact': {'savings': 0, 'debt': 10, 'income': 0, 'expenses': 0}
                    },
                    {
                        'value': 'part_time_bar_work',
                        'label': 'Find Weekend Bar Work',
                        'description': 'Look for shifts in the Student Union or local pubs',
                        'impact': {'savings': 5, 'debt': 0, 'income': 20, 'expenses': 5}
                    }
                ]
            },
            {
                'scenario': "The new term is starting at uni, and you need to purchase textbooks. You can buy new, get used ones from the SU shop, or find digital versions. What\'s your plan?",
                'options': [
                    {
                        'value': 'buy_new_books',
                        'label': 'Buy New Textbooks',
                        'description': 'Purchase all required textbooks brand new',
                        'impact': {'savings': -25, 'debt': 0, 'income': 0, 'expenses': 5}
                    },
                    {
                        'value': 'second_hand_books',
                        'label': 'Shop at the SU',
                        'description': 'Buy second-hand books from the Student Union shop',
                        'impact': {'savings': -10, 'debt': 0, 'income': 0, 'expenses': 3}
                    },
                    {
                        'value': 'digital_resources',
                        'label': 'Use Digital Resources',
                        'description': 'Find e-books and online alternatives',
                        'impact': {'savings': -5, 'debt': 0, 'income': 0, 'expenses': 1}
                    },
                    {
                        'value': 'library_borrowing',
                        'label': 'Borrow from Library',
                        'description': 'Use the university library resources',
                        'impact': {'savings': 0, 'debt': 0, 'income': 0, 'expenses': 0}
                    }
                ]
            },
            {
                'scenario': "Your laptop needs replacing before assignment deadlines. You could use your overdraft, ask parents for help, or use the uni computer labs. What will you do?",
                'options': [
                    {
                        'value': 'buy_new_laptop',
                        'label': 'Buy a New Laptop',
                        'description': 'Purchase a new computer using your overdraft',
                        'impact': {'savings': -10, 'debt': 30, 'income': 0, 'expenses': 5}
                    },
                    {
                        'value': 'ask_parents',
                        'label': 'Ask Parents for Help',
                        'description': 'See if your family can contribute to a new laptop',
                        'impact': {'savings': 0, 'debt': 0, 'income': 25, 'expenses': 0}
                    },
                    {
                        'value': 'use_uni_computers',
                        'label': 'Use University Facilities',
                        'description': 'Work in the computer labs and library',
                        'impact': {'savings': 5, 'debt': 0, 'income': 0, 'expenses': 5}
                    },
                    {
                        'value': 'refurbished_laptop',
                        'label': 'Buy Refurbished',
                        'description': 'Get a cheaper refurbished model',
                        'impact': {'savings': -15, 'debt': 5, 'income': 0, 'expenses': 2}
                    }
                ]
            },
            {
                'scenario': "Your flatmates are planning a holiday to Spain during reading week. It would cost £450 but could be a great experience. How do you handle this?",
                'options': [
                    {
                        'value': 'go_on_holiday',
                        'label': 'Join the Holiday',
                        'description': 'Spend £450 on the trip to Spain',
                        'impact': {'savings': -30, 'debt': 10, 'income': 0, 'expenses': 20}
                    },
                    {
                        'value': 'budget_staycation',
                        'label': 'Plan a Staycation',
                        'description': 'Suggest more affordable UK activities',
                        'impact': {'savings': -10, 'debt': 0, 'income': 0, 'expenses': 8}
                    },
                    {
                        'value': 'skip_holiday',
                        'label': 'Skip the Holiday',
                        'description': 'Focus on studying and saving money',
                        'impact': {'savings': 15, 'debt': 0, 'income': 5, 'expenses': -5}
                    },
                    {
                        'value': 'extra_work_hours',
                        'label': 'Work Extra Hours',
                        'description': 'Pick up additional shifts to fund the trip',
                        'impact': {'savings': -15, 'debt': 0, 'income': 25, 'expenses': 15}
                    }
                ]
            },
            {
                'scenario': "You\'ve received a £300 bursary from your university. Will you save it in your ISA, use it for everyday expenses, or invest in a professional development course?",
                'options': [
                    {
                        'value': 'save_in_isa',
                        'label': 'Save in Cash ISA',
                        'description': 'Put the money in a tax-free savings account',
                        'impact': {'savings': 30, 'debt': 0, 'income': 1, 'expenses': 0}
                    },
                    {
                        'value': 'everyday_expenses',
                        'label': 'Cover Living Costs',
                        'description': 'Use it for rent, groceries and bills',
                        'impact': {'savings': 0, 'debt': -5, 'income': 0, 'expenses': -10}
                    },
                    {
                        'value': 'professional_course',
                        'label': 'Take a Development Course',
                        'description': 'Invest in skills that may increase future earnings',
                        'impact': {'savings': -15, 'debt': 0, 'income': 8, 'expenses': 5}
                    },
                    {
                        'value': 'split_bursary',
                        'label': 'Split the Money',
                        'description': 'Save half, spend half on necessities',
                        'impact': {'savings': 15, 'debt': -2, 'income': 0, 'expenses': -5}
                    }
                ]
            }
        ],
        'Entrepreneur': [
            {
                'scenario': "A potential angel investor from London Tech Angels is interested in your startup. They offer £50,000 funding but want 25% equity. What\'s your decision?",
                'options': [
                    {
                        'value': 'accept_investment',
                        'label': 'Accept the Offer',
                        'description': 'Take the £50,000 investment for 25% equity',
                        'impact': {'savings': 50, 'debt': -20, 'income': 25, 'expenses': 15}
                    },
                    {
                        'value': 'negotiate_terms',
                        'label': 'Negotiate Better Terms',
                        'description': 'Counter with 15% equity for the same investment',
                        'impact': {'savings': 20, 'debt': 0, 'income': 10, 'expenses': 5}
                    },
                    {
                        'value': 'decline_investment',
                        'label': 'Decline the Offer',
                        'description': 'Keep full ownership and bootstrap the business',
                        'impact': {'savings': -10, 'debt': 15, 'income': 5, 'expenses': -5}
                    },
                    {
                        'value': 'seek_alternatives',
                        'label': 'Explore Other Funding',
                        'description': 'Look into UK government startup grants and loans',
                        'impact': {'savings': 10, 'debt': 10, 'income': 5, 'expenses': 0}
                    }
                ]
            },
            {
                'scenario': "Your business is growing and you\'re stretched thin. You can hire a part-time assistant for £1,200/month or work longer hours yourself. What will you do?",
                'options': [
                    {
                        'value': 'hire_assistant',
                        'label': 'Hire a Part-time Assistant',
                        'description': 'Pay £1,200/month for professional help',
                        'impact': {'savings': -12, 'debt': 0, 'income': 15, 'expenses': 12}
                    },
                    {
                        'value': 'work_longer',
                        'label': 'Work Longer Hours',
                        'description': 'Handle everything yourself to save money',
                        'impact': {'savings': 10, 'debt': 0, 'income': 5, 'expenses': -5}
                    },
                    {
                        'value': 'outsource_tasks',
                        'label': 'Use Freelancers',
                        'description': 'Outsource specific tasks on platforms like Fiverr',
                        'impact': {'savings': -5, 'debt': 0, 'income': 10, 'expenses': 8}
                    },
                    {
                        'value': 'business_automation',
                        'label': 'Invest in Automation',
                        'description': 'Implement software to streamline operations',
                        'impact': {'savings': -15, 'debt': 5, 'income': 12, 'expenses': -8}
                    }
                ]
            },
            {
                'scenario': "A competitor in your industry is closing down and offers to sell their client list for £5,000. It could bring in new business but is pricey. What\'s your choice?",
                'options': [
                    {
                        'value': 'buy_client_list',
                        'label': 'Purchase the Client List',
                        'description': 'Invest £5,000 to acquire potential new customers',
                        'impact': {'savings': -15, 'debt': 0, 'income': 25, 'expenses': 5}
                    },
                    {
                        'value': 'negotiate_price',
                        'label': 'Negotiate a Lower Price',
                        'description': 'Try to get the list for £2,500',
                        'impact': {'savings': -8, 'debt': 0, 'income': 15, 'expenses': 3}
                    },
                    {
                        'value': 'decline_purchase',
                        'label': 'Focus on Organic Growth',
                        'description': 'Build your client base through marketing instead',
                        'impact': {'savings': 0, 'debt': 0, 'income': 8, 'expenses': 10}
                    },
                    {
                        'value': 'partnership_offer',
                        'label': 'Offer a Partnership',
                        'description': 'Propose a commission-based referral arrangement',
                        'impact': {'savings': -5, 'debt': 0, 'income': 12, 'expenses': 7}
                    }
                ]
            },
            {
                'scenario': "You have £8,000 to invest in your business. You can either upgrade your equipment or invest in digital marketing with a London agency. Which path do you choose?",
                'options': [
                    {
                        'value': 'upgrade_equipment',
                        'label': 'Upgrade Equipment',
                        'description': 'Invest in better equipment to improve productivity',
                        'impact': {'savings': -20, 'debt': 0, 'income': 15, 'expenses': -10}
                    },
                    {
                        'value': 'digital_marketing',
                        'label': 'Hire a Marketing Agency',
                        'description': 'Invest in professional digital marketing services',
                        'impact': {'savings': -20, 'debt': 0, 'income': 30, 'expenses': 10}
                    },
                    {
                        'value': 'split_investment',
                        'label': 'Split the Investment',
                        'description': 'Allocate funds to both equipment and marketing',
                        'impact': {'savings': -20, 'debt': 0, 'income': 22, 'expenses': 0}
                    },
                    {
                        'value': 'training_development',
                        'label': 'Invest in Skills Development',
                        'description': 'Take courses to enhance your business capabilities',
                        'impact': {'savings': -15, 'debt': 0, 'income': 18, 'expenses': -5}
                    }
                ]
            },
            {
                'scenario': "There\'s an opportunity to expand your business to Manchester, but it requires £15,000 upfront for a new location. How do you proceed?",
                'options': [
                    {
                        'value': 'expand_location',
                        'label': 'Open the Manchester Office',
                        'description': 'Invest £15,000 to expand to a new location',
                        'impact': {'savings': -30, 'debt': 20, 'income': 40, 'expenses': 25}
                    },
                    {
                        'value': 'virtual_presence',
                        'label': 'Establish Virtual Presence',
                        'description': 'Use co-working spaces and virtual meetings instead',
                        'impact': {'savings': -5, 'debt': 0, 'income': 15, 'expenses': 8}
                    },
                    {
                        'value': 'partnership_expansion',
                        'label': 'Find a Local Partner',
                        'description': 'Partner with an existing Manchester business',
                        'impact': {'savings': -10, 'debt': 0, 'income': 20, 'expenses': 10}
                    },
                    {
                        'value': 'delay_expansion',
                        'label': 'Delay Expansion Plans',
                        'description': 'Build more capital before expanding',
                        'impact': {'savings': 10, 'debt': -5, 'income': 5, 'expenses': 0}
                    }
                ]
            }
        ],
        'Artist': [
            {
                'scenario': "A popular gallery in Bristol offers to showcase your work, but you need to pay £600 for the space upfront. Is this a worthwhile investment?",
                'options': [
                    {
                        'value': 'pay_gallery_fee',
                        'label': 'Pay the Gallery Fee',
                        'description': 'Invest £600 to showcase your work',
                        'impact': {'savings': -15, 'debt': 0, 'income': 25, 'expenses': 5}
                    },
                    {
                        'value': 'negotiate_commission',
                        'label': 'Negotiate a Commission Deal',
                        'description': 'Offer a higher commission on sales instead of upfront fee',
                        'impact': {'savings': 0, 'debt': 0, 'income': 15, 'expenses': 0}
                    },
                    {
                        'value': 'find_alternative_venue',
                        'label': 'Look for a Different Venue',
                        'description': 'Search for cafes or community spaces with lower fees',
                        'impact': {'savings': -5, 'debt': 0, 'income': 10, 'expenses': 3}
                    },
                    {
                        'value': 'online_exhibition',
                        'label': 'Focus on Online Exhibition',
                        'description': 'Invest in a virtual gallery on your website instead',
                        'impact': {'savings': -8, 'debt': 0, 'income': 12, 'expenses': 2}
                    }
                ]
            },
            {
                'scenario': "You need supplies for your next project. You can invest £400 in premium materials or £150 in basic supplies. What\'s your approach?",
                'options': [
                    {
                        'value': 'premium_materials',
                        'label': 'Buy Premium Materials',
                        'description': 'Invest £400 in high-quality supplies',
                        'impact': {'savings': -12, 'debt': 0, 'income': 20, 'expenses': 5}
                    },
                    {
                        'value': 'basic_supplies',
                        'label': 'Use Basic Supplies',
                        'description': 'Spend £150 on standard materials',
                        'impact': {'savings': -5, 'debt': 0, 'income': 10, 'expenses': 3}
                    },
                    {
                        'value': 'mixed_approach',
                        'label': 'Mix Premium and Basic',
                        'description': 'Use premium materials for key elements only',
                        'impact': {'savings': -8, 'debt': 0, 'income': 15, 'expenses': 4}
                    },
                    {
                        'value': 'upcycled_materials',
                        'label': 'Use Upcycled Materials',
                        'description': 'Create art from repurposed or found objects',
                        'impact': {'savings': -2, 'debt': 0, 'income': 8, 'expenses': 1}
                    }
                ]
            },
            {
                'scenario': "A prestigious client offers a rush commission that pays £1,200, but you\'ll need to cancel other commitments worth £800. What do you do?",
                'options': [
                    {
                        'value': 'accept_commission',
                        'label': 'Accept the Rush Commission',
                        'description': 'Take the £1,200 job and cancel other commitments',
                        'impact': {'savings': 10, 'debt': 0, 'income': 12, 'expenses': 0}
                    },
                    {
                        'value': 'negotiate_deadline',
                        'label': 'Negotiate the Deadline',
                        'description': 'Try to keep all commitments by adjusting timelines',
                        'impact': {'savings': 15, 'debt': 0, 'income': 20, 'expenses': 5}
                    },
                    {
                        'value': 'honor_commitments',
                        'label': 'Honor Existing Commitments',
                        'description': 'Decline the rush job to maintain relationships',
                        'impact': {'savings': 5, 'debt': 0, 'income': 8, 'expenses': 0}
                    },
                    {
                        'value': 'outsource_work',
                        'label': 'Collaborate with Another Artist',
                        'description': 'Share the commission with another artist to manage all work',
                        'impact': {'savings': 3, 'debt': 0, 'income': 10, 'expenses': 4}
                    }
                ]
            },
            {
                'scenario': "The Royal College of Art is offering a specialized workshop that could enhance your skills, but it costs £850. How do you handle this opportunity?",
                'options': [
                    {
                        'value': 'pay_for_workshop',
                        'label': 'Attend the Workshop',
                        'description': 'Invest £850 in your professional development',
                        'impact': {'savings': -20, 'debt': 5, 'income': 15, 'expenses': 0}
                    },
                    {
                        'value': 'apply_for_grant',
                        'label': 'Apply for an Arts Council Grant',
                        'description': 'Seek funding to cover the workshop costs',
                        'impact': {'savings': -5, 'debt': 0, 'income': 10, 'expenses': 0}
                    },
                    {
                        'value': 'self_taught_alternative',
                        'label': 'Learn Through Online Resources',
                        'description': 'Find free or low-cost alternatives for skill development',
                        'impact': {'savings': -2, 'debt': 0, 'income': 5, 'expenses': 0}
                    },
                    {
                        'value': 'skill_exchange',
                        'label': 'Offer a Skill Exchange',
                        'description': 'Propose teaching a workshop in exchange for attendance',
                        'impact': {'savings': 0, 'debt': 0, 'income': 8, 'expenses': 3}
                    }
                ]
            },
            {
                'scenario': "Not On The High Street wants to feature your work on their platform but takes a 35% commission. Will you join their marketplace?",
                'options': [
                    {
                        'value': 'join_marketplace',
                        'label': 'Join Not On The High Street',
                        'description': 'Accept the 35% commission for greater exposure',
                        'impact': {'savings': 5, 'debt': 0, 'income': 25, 'expenses': 8}
                    },
                    {
                        'value': 'negotiate_terms',
                        'label': 'Negotiate Commission Rate',
                        'description': 'Try to secure a lower commission percentage',
                        'impact': {'savings': 8, 'debt': 0, 'income': 15, 'expenses': 5}
                    },
                    {
                        'value': 'independent_shop',
                        'label': 'Focus on Your Own Shop',
                        'description': 'Invest in your own Shopify or Etsy store instead',
                        'impact': {'savings': -10, 'debt': 0, 'income': 18, 'expenses': 12}
                    },
                    {
                        'value': 'selective_listing',
                        'label': 'List Selected Items Only',
                        'description': 'Put only high-margin items on the marketplace',
                        'impact': {'savings': 3, 'debt': 0, 'income': 12, 'expenses': 4}
                    }
                ]
            }
        ],
        'Banker': [
            {
                'scenario': "Your company offers share options as part of your bonus package. Will you exercise them (worth potentially £8,000) or take the cash equivalent of £5,500?",
                'options': [
                    {
                        'value': 'exercise_options',
                        'label': 'Exercise Share Options',
                        'description': 'Take the £8,000 in company shares',
                        'impact': {'savings': 20, 'debt': 0, 'income': 5, 'expenses': 0}
                    },
                    {
                        'value': 'take_cash',
                        'label': 'Take Cash Bonus',
                        'description': 'Accept the £5,500 cash equivalent',
                        'impact': {'savings': 15, 'debt': -10, 'income': 0, 'expenses': 0}
                    },
                    {
                        'value': 'split_bonus',
                        'label': 'Split Between Cash and Shares',
                        'description': 'Take half in shares and half in cash',
                        'impact': {'savings': 18, 'debt': -5, 'income': 3, 'expenses': 0}
                    },
                    {
                        'value': 'defer_decision',
                        'label': 'Defer the Decision',
                        'description': 'Wait for a better share price before deciding',
                        'impact': {'savings': 0, 'debt': 0, 'income': 10, 'expenses': 0}
                    }
                ]
            },
            {
                'scenario': "You\'ve spotted a promising investment opportunity in UK tech stocks, but it's relatively high-risk. Will you invest £10,000 from your portfolio?",
                'options': [
                    {
                        'value': 'invest_tech_stocks',
                        'label': 'Invest £10,000',
                        'description': 'Make the full investment in UK tech stocks',
                        'impact': {'savings': -25, 'debt': 0, 'income': 35, 'expenses': 0}
                    },
                    {
                        'value': 'partial_investment',
                        'label': 'Invest £5,000',
                        'description': 'Make a smaller investment to limit exposure',
                        'impact': {'savings': -12, 'debt': 0, 'income': 15, 'expenses': 0}
                    },
                    {
                        'value': 'diversified_approach',
                        'label': 'Diversify Your Investment',
                        'description': 'Spread £10,000 across tech stocks and safer options',
                        'impact': {'savings': -25, 'debt': 0, 'income': 20, 'expenses': 0}
                    },
                    {
                        'value': 'research_further',
                        'label': 'Conduct More Research',
                        'description': 'Hold off on investing until you gather more information',
                        'impact': {'savings': 0, 'debt': 0, 'income': 5, 'expenses': 0}
                    }
                ]
            },
            {
                'scenario': "A Chartered Financial Analyst qualification could advance your career but costs £5,000 and requires significant study time. Is this the right move?",
                'options': [
                    {
                        'value': 'pursue_cfa',
                        'label': 'Pursue CFA Qualification',
                        'description': 'Invest £5,000 in the CFA program',
                        'impact': {'savings': -15, 'debt': 0, 'income': 30, 'expenses': 5}
                    },
                    {
                        'value': 'employer_sponsorship',
                        'label': 'Request Employer Sponsorship',
                        'description': 'Ask your bank to cover the qualification costs',
                        'impact': {'savings': 0, 'debt': 0, 'income': 20, 'expenses': 0}
                    },
                    {
                        'value': 'alternative_qualification',
                        'label': 'Consider Alternative Certifications',
                        'description': 'Look into less expensive qualifications with similar benefits',
                        'impact': {'savings': -8, 'debt': 0, 'income': 15, 'expenses': 3}
                    },
                    {
                        'value': 'focus_on_experience',
                        'label': 'Focus on Practical Experience',
                        'description': 'Build expertise through projects rather than certifications',
                        'impact': {'savings': 0, 'debt': 0, 'income': 10, 'expenses': 0}
                    }
                ]
            },
            {
                'scenario': "You have £20,000 to invest. You can choose between a safe FTSE tracker fund or active management with higher potential returns. What\'s your strategy?",
                'options': [
                    {
                        'value': 'ftse_tracker',
                        'label': 'FTSE Tracker Fund',
                        'description': 'Invest in a low-cost FTSE 100 index fund',
                        'impact': {'savings': -20, 'debt': 0, 'income': 15, 'expenses': 0}
                    },
                    {
                        'value': 'active_management',
                        'label': 'Active Fund Management',
                        'description': 'Choose a professionally managed fund with higher fees',
                        'impact': {'savings': -20, 'debt': 0, 'income': 25, 'expenses': 5}
                    },
                    {
                        'value': 'mixed_portfolio',
                        'label': 'Build a Mixed Portfolio',
                        'description': 'Allocate funds across both passive and active investments',
                        'impact': {'savings': -20, 'debt': 0, 'income': 20, 'expenses': 3}
                    },
                    {
                        'value': 'property_investment',
                        'label': 'Invest in Property',
                        'description': 'Use as deposit for a buy-to-let property investment',
                        'impact': {'savings': -20, 'debt': 20, 'income': 30, 'expenses': 15}
                    }
                ]
            },
            {
                'scenario': "A fintech startup approaches you to become an early investor with £15,000 for a 3% stake. How do you respond to this opportunity?",
                'options': [
                    {
                        'value': 'invest_startup',
                        'label': 'Invest in the Startup',
                        'description': 'Provide £15,000 for a 3% equity stake',
                        'impact': {'savings': -30, 'debt': 0, 'income': 40, 'expenses': 0}
                    },
                    {
                        'value': 'negotiate_equity',
                        'label': 'Negotiate for More Equity',
                        'description': 'Counter with £15,000 for 5% stake',
                        'impact': {'savings': -30, 'debt': 0, 'income': 20, 'expenses': 0}
                    },
                    {
                        'value': 'smaller_investment',
                        'label': 'Make a Smaller Investment',
                        'description': 'Offer £7,500 for a 1.5% stake',
                        'impact': {'savings': -15, 'debt': 0, 'income': 20, 'expenses': 0}
                    },
                    {
                        'value': 'decline_opportunity',
                        'label': 'Decline the Opportunity',
                        'description': 'Focus on more established investments',
                        'impact': {'savings': 0, 'debt': 0, 'income': 0, 'expenses': 0}
                    }
                ]
            }
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
    
    # Process financial decision impact (this would be better tied to specific decisions but keeping simple for now)
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
    
    # Choose next scenario and matching options
    career_path_str = str(career_path)
    career_scenarios = scenarios_with_options.get(career_path_str, scenarios_with_options['Student'])
    chosen_scenario = random.choice(career_scenarios)
    next_scenario = chosen_scenario['scenario']
    decision_options = chosen_scenario['options']
    
    # Format the decision options for the next prompt
    formatted_options = ""
    for option in decision_options:
        formatted_options += f"- {option['label']}: {option['description']}\n"
    
    # If we're continuing, update the next_scenario to include option information
    if next_step == 'continue':
        next_scenario += f"\n\nYou need to choose from the following options:\n{formatted_options}"
    
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

🎯 **Next Scenario:**
{next_scenario}

What\'s your decision?'''
    
    # Return response with financial data
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
        debt=debt,
        decision_options=decision_options
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
    
    # Calculate leaderboard position (random for now)
    leaderboard_position = random.randint(1, 100)
    
    # Create prompt for the AI
    prompt = f'''
The player, {player_name}, has completed their Financial Twin simulation as a {career_path}.

Their final status:
- XP Earned: {xp_earned}
- Level: {level}
- Achievements Unlocked: {', '.join(achievements)}
- Last Decision Made: {financial_decision}
- Leaderboard Position: {leaderboard_position}

Generate a congratulatory conclusion message summarizing their journey in the Financial Twin simulation. Highlight their achievements and give them 2-3 personalized financial tips based on their chosen career path ({career_path}) that are specific to the UK financial context.

Use UK-specific financial terms and references (ISAs, Help to Buy, NS&I, UK tax bands, etc.) in your advice.
'''
    
    # Generate conclusion message
    response = client.evaluate_prompt(prompt=prompt, system_message='As a friendly game host, generate an uplifting conclusion message for the player. Be encouraging, positive, and provide specific financial advice relevant to their career path in the UK context.').content
    
    # Return response with final data
    return AbacusResponse(
        response,
        final_xp=xp_earned,
        final_level=level,
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
        # Call the appropriate function based on the function_name
        if function_name == "welcome_node_function":
            response = welcome_node_function(
                player_name=params.get('player_name', 'Player'),
                career_choice=params.get('career_choice', 'Student')
            )
        elif function_name == "initialize_financial_twin_function":
            response = initialize_financial_twin_function(
                career_path=params.get('career_path', 'Student'),
                acknowledge_status=params.get('acknowledge_status', 'Acknowledged')
            )
        elif function_name == "process_financial_decisions_function":
            response = process_financial_decisions_function(
                career_path=params.get('career_path', 'Student'),
                income=params.get('income', 0),
                expenses=params.get('expenses', 0),
                savings=params.get('savings', 0),
                debt=params.get('debt', 0),
                financial_decision=params.get('financial_decision', ''),
                next_step=params.get('next_step', 'continue')
            )
        elif function_name == "conclude_session_function":
            response = conclude_session_function(
                player_name=params.get('player_name', 'Player'),
                career_path=params.get('career_path', 'Student'),
                xp_earned=params.get('xp_earned', 0),
                level=params.get('level', 1),
                achievements=params.get('achievements', []),
                financial_decision=params.get('financial_decision', '')
            )
        else:
            # Return an error message if function name is not recognized
            return json.dumps({"error": f"Unknown function: {function_name}"})
        
        # Return the response as a JSON string
        return response.to_json()
    
    except Exception as e:
        # Return an error message if an exception occurs
        return json.dumps({"error": f"Error executing {function_name}: {str(e)}"})

# Main entry point when called directly
if __name__ == "__main__":
    # Check if arguments are provided
    if len(sys.argv) > 1:
        # Get function name and parameters from command line
        function_name = sys.argv[1]
        params_json = sys.argv[2] if len(sys.argv) > 2 else "{}"
        
        # Parse parameters JSON
        try:
            params = json.loads(params_json)
        except json.JSONDecodeError:
            params = {}
        
        # Run the requested function and print the response
        print(run_game_function(function_name, params))
    else:
        # Print usage information if no arguments are provided
        print("Usage: python financial_twin.py <function_name> <params_json>")