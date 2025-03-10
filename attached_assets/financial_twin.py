## <Welcome Node node source code>
def welcome_node_function(player_name: object, career_choice: object):
    from abacusai import AgentResponse, ApiClient
    client = ApiClient()
    prompt = f'''You are a friendly game host. A new player named {player_name} has joined the game.

Introduce the player to the Interactive Financial Simulation Game where they will create a virtual financial twin and navigate through life's financial challenges.

Explain that they can choose from one of the following career paths, each with unique financial challenges and story-driven missions:

1. Student
2. Entrepreneur
3. Artist
4. Banker

They have chosen the career path: {career_choice.title()}.

Provide an enthusiastic welcome message that acknowledges their choice and sets the stage for their journey as a {career_choice.title()}.
'''
    response = client.evaluate_prompt(prompt=prompt, system_message='As a game host, generate a welcoming message for the player. Be friendly, engaging, and set a positive tone for the game.').content
    return AgentResponse(content=response, career_path=career_choice)

### <Initialize Financial Twin node source code>
def initialize_financial_twin_function(career_path: object, acknowledge_status: object):
    from abacusai import AgentResponse, ApiClient
    client = ApiClient()
    career_data = {'Student': {'income': 1200.0, 'expenses': 1000.0, 'savings': 500.0, 'debt': 20000.0}, 'Entrepreneur': {'income': 3000.0, 'expenses': 2500.0, 'savings': 10000.0, 'debt': 50000.0}, 'Artist': {'income': 2000.0, 'expenses': 1800.0, 'savings': 2000.0, 'debt': 15000.0}, 'Banker': {'income': 7000.0, 'expenses': 5000.0, 'savings': 30000.0, 'debt': 10000.0}}
    financial_status = career_data.get(career_path, {'income': 0.0, 'expenses': 0.0, 'savings': 0.0, 'debt': 0.0})
    income = financial_status['income']
    expenses = financial_status['expenses']
    savings = financial_status['savings']
    debt = financial_status['debt']
    prompt = f'''
You are a financial game host. A player has chosen the career path of {career_path}.

Their initial financial status is:
- Income: ${income} per month
- Expenses: ${expenses} per month
- Savings: ${savings}
- Debt: ${debt}

Present this initial financial status to the player, providing a clear breakdown.

Then, introduce the first financial challenge or story mission relevant to the chosen career path. The challenge should be appropriate for a {career_path}.

Ask the player to make decisions regarding financial choices, such as budgeting, investing, paying off debt, or making purchases. Present at least two options for them to choose from.

Use an engaging and motivating tone.
'''
    system_message = 'As a friendly game host, generate an engaging message for the player, presenting their initial financial status, introducing the first financial challenge, and asking them to make decisions. Keep the message under 500 words.'
    response = client.evaluate_prompt(prompt=prompt, system_message=system_message).content
    return AgentResponse(content=response, income=income, expenses=expenses, savings=savings, debt=debt, career_path=career_path)

### <Process Financial Decisions node source code>
def process_financial_decisions_function(career_path: object, income: object, expenses: object, savings: object, debt: object, financial_decision: object, next_step: object):
    from abacusai import AgentResponse, ApiClient
    import random
    import math
    client = ApiClient()
    scenarios = {'Student': ["Your student loan payment is due, but you've found a part-time job opportunity that could help. What's your decision?", "A new semester is starting, and you need textbooks. You can buy new, used, or digital versions. What's your choice?", 'Your laptop is getting old. You can repair it, buy a new one, or use the library computers. What will you do?', "Your friends are planning a spring break trip. It's expensive but could be a great experience. How do you handle this?", "You've received a small scholarship. Will you save it, use it for current expenses, or invest in a skill-building course?"], 'Entrepreneur': ["A potential investor is interested in your startup. They offer funding but want 30% equity. What's your decision?", "Your product is gaining traction, but you need to decide between hiring help or working longer hours. What's your choice?", "A competitor is struggling and offers to sell their client list. It's expensive but could boost your business. What do you do?", 'You can either invest in new equipment to improve efficiency or spend on marketing. Which path do you choose?', 'An opportunity to expand to a new market appears, but it requires significant upfront investment. How do you proceed?'], 'Artist': ["A gallery offers to showcase your work, but you need to pay for the space upfront. What's your decision?", "You can either invest in high-quality materials or save money with basic supplies. What's your choice?", 'A client requests a rush job at a higher rate, but it means canceling other commitments. What do you do?', 'You have the chance to attend an exclusive workshop that could enhance your skills. How do you handle the cost?', "An online platform wants to feature your work but takes a 40% commission. What's your approach?"], 'Banker': ['Your company offers stock options as part of your bonus. Will you exercise them or take the cash equivalent?', "You've spotted a promising investment opportunity, but it's relatively high-risk. What's your decision?", "A prestigious certification could advance your career but requires significant time and money. What's your choice?", "You can either invest in a safe index fund or try active trading with higher potential returns. What's your strategy?", 'A startup approaches you for angel investment. How do you respond to this opportunity?']}
    monthly_savings = (income - expenses)
    debt_to_income_ratio = ((debt / (income * 12)) if (income > 0) else float('inf'))
    savings_ratio = ((savings / income) if (income > 0) else 0)
    achievements = []
    if (monthly_savings > 0):
        achievements.append('Positive Cash Flow Master')
    if (savings_ratio > 0.2):
        achievements.append('Strategic Saver')
    if (debt_to_income_ratio < 0.3):
        achievements.append('Debt Management Expert')
    if (savings > 50000):
        achievements.append('Wealth Builder')
    if (debt == 0):
        achievements.append('Debt Free Champion')
    xp_earned = 50
    if (monthly_savings > 0):
        xp_earned += 25
    if (len(achievements) > 0):
        xp_earned += (25 * len(achievements))
    level = (math.floor((xp_earned / 100)) + 1)
    decision_lower = financial_decision.lower()
    if ('invest' in decision_lower):
        savings -= 1000
        if (random.random() < 0.7):
            income += 200
    elif ('save' in decision_lower):
        savings += 500
        achievements.append('Savings Milestone')
    elif (('pay' in decision_lower) and ('debt' in decision_lower)):
        debt_payment = min(2000, debt)
        debt -= debt_payment
        savings -= debt_payment
    crisis_event = None
    if (random.random() < 0.2):
        crisis_events = {'Medical Emergency': {'cost': 5000, 'message': 'You faced an unexpected medical expense.'}, 'Job Setback': {'income_reduction': 0.2, 'message': 'Your income was temporarily reduced.'}, 'Car Repair': {'cost': 2000, 'message': 'Your car needed urgent repairs.'}, 'Family Emergency': {'cost': 3000, 'message': 'A family emergency required financial support.'}}
        crisis_type = random.choice(list(crisis_events.keys()))
        crisis = crisis_events[crisis_type]
        crisis_event = crisis['message']
        if ('cost' in crisis):
            savings -= crisis['cost']
        if ('income_reduction' in crisis):
            income *= (1 - crisis['income_reduction'])
    career_scenarios = scenarios[career_path]
    next_scenario = random.choice(career_scenarios)
    response = f'''🎮 **Financial Twin Simulation Update** 🎮

💫 **Current Status:**
Level: {level} (XP: {xp_earned})
🏆 Achievements: {', '.join(achievements)}

💰 **Financial Metrics:**
Monthly Income: ${income:,.2f}
Monthly Expenses: ${expenses:,.2f}
Savings: ${savings:,.2f}
Debt: ${debt:,.2f}
Monthly Savings: ${monthly_savings:,.2f}
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
    if (next_step == 'Continue with next scenario'):
        response += f'''
🎯 **Next Scenario:**
{next_scenario}

What's your decision?'''
    else:
        response += "\n🏁 **Session Complete!**\nLet's see your final summary..."
    return AgentResponse(content=response, xp_earned=xp_earned, level=level, achievements=achievements, crisis_event=crisis_event, monthly_savings=monthly_savings, debt_to_income_ratio=debt_to_income_ratio, savings_ratio=savings_ratio, next_step=next_step, income=income, expenses=expenses, savings=savings, debt=debt)

### <Conclude Session node source code>
def conclude_session_function(player_name: object, career_path: object, xp_earned: object, level: object, achievements: object, financial_decision: object):
    from abacusai import AgentResponse, ApiClient
    from typing import List
    client = ApiClient()
    leaderboard = [{'player_name': 'Alice', 'xp': 1200}, {'player_name': 'Bob', 'xp': 1100}, {'player_name': player_name, 'xp': xp_earned}, {'player_name': 'Charlie', 'xp': 900}]
    leaderboard.sort(key=(lambda x: x['xp']), reverse=True)
    leaderboard_text = 'Current Leaderboard:\n'
    for (rank, player) in enumerate(leaderboard, start=1):
        leaderboard_text += f'''{rank}. {player['player_name']} - XP: {player['xp']}
'''
    financial_insights = f'''You made the following financial decision during the simulation:
- {financial_decision}
'''
    prompt = f'''
As the game host, conclude the simulation session for player {player_name}.

Provide a summary of their financial performance:
- Career Path: {career_path}
- Total XP Earned: {xp_earned}
- Level Achieved: {level}
- Achievements Unlocked: {(', '.join(achievements) if achievements else 'None')}

Provide data-driven insights on their spending patterns and financial decisions:
{financial_insights}

Update and display the leaderboards:
{leaderboard_text}

Thank the player for participating and encourage them to return for more gamified financial learning experiences.
'''
    system_message = "As a friendly game host, provide a concluding message that summarizes the player's performance, offers insights, displays the leaderboard, and encourages them to return."
    response = client.evaluate_prompt(prompt=prompt, system_message=system_message).content
    return AgentResponse(content=response)