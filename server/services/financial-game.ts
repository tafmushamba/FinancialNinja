/**
 * Financial Game Service
 * Provides integration with the Python Financial Twin game
 */
import { PythonShell } from 'python-shell';
import path from 'path';
import { log } from '../vite';

/**
 * Types for Financial Game data
 */
export interface FinancialGameData {
  content: string;
  career_path?: string;
  income?: number;
  expenses?: number;
  savings?: number;
  debt?: number;
  xp_earned?: number;
  level?: number;
  achievements?: string[];
  crisis_event?: string | null;
  monthly_savings?: number;
  debt_to_income_ratio?: number;
  savings_ratio?: number;
  next_step?: string;
  final_xp?: number;
  final_level?: number;
  final_achievements?: string[];
  leaderboard_position?: number;
  error?: string;
}

/**
 * Run a Python game function with parameters
 */
async function runGameFunction(
  functionName: string,
  params: Record<string, any>
): Promise<FinancialGameData> {
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: path.join(process.cwd(), 'python_modules'),
      args: []
    };

    const data = {
      function: functionName,
      params
    };

    // Log the data being sent to Python
    log(`Sending data to Python: ${JSON.stringify(data)}`, 'python');

    // Use stdio instead of stdin (which is not a valid option)
    const results = await PythonShell.run('game_runner.py', {
      ...options,
      stdio: 'pipe',
      // Pass the data as input to the Python script
      stdinString: JSON.stringify(data)
    });

    // The result will be a stringified JSON object
    const resultData = JSON.parse(results.join('')) as FinancialGameData;
    return resultData;
  } catch (error) {
    log(`Error running game function ${functionName}:`, 'python');
    log(`${error}`, 'python');
    return {
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Start a new game session with player name and career choice
 */
export async function startGame(
  playerName: string,
  careerChoice: string
): Promise<FinancialGameData> {
  return runGameFunction('welcome_node_function', {
    player_name: playerName,
    career_choice: careerChoice
  });
}

/**
 * Initialize financial twin with career path
 */
export async function initializeFinancialTwin(
  careerPath: string,
  acknowledgeStatus: string
): Promise<FinancialGameData> {
  return runGameFunction('initialize_financial_twin_function', {
    career_path: careerPath,
    acknowledge_status: acknowledgeStatus
  });
}

/**
 * Process financial decision and update game state
 */
export async function processFinancialDecision(
  careerPath: string,
  income: number,
  expenses: number,
  savings: number,
  debt: number,
  financialDecision: string,
  nextStep: string
): Promise<FinancialGameData> {
  return runGameFunction('process_financial_decisions_function', {
    career_path: careerPath,
    income: income,
    expenses: expenses,
    savings: savings,
    debt: debt,
    financial_decision: financialDecision,
    next_step: nextStep
  });
}

/**
 * Conclude game session and get final summary
 */
export async function concludeGameSession(
  playerName: string,
  careerPath: string,
  xpEarned: number,
  level: number,
  achievements: string[],
  financialDecision: string
): Promise<FinancialGameData> {
  return runGameFunction('conclude_session_function', {
    player_name: playerName,
    career_path: careerPath,
    xp_earned: xpEarned,
    level: level,
    achievements: achievements,
    financial_decision: financialDecision
  });
}