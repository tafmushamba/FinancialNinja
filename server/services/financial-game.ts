/**
 * Financial Game Service
 * Provides integration with the Python Financial Twin game
 */
import { PythonShell } from 'python-shell';
import path from 'path';

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
      mode: 'text' as const,
      pythonPath: 'python3',
      scriptPath: path.join(process.cwd(), 'python_modules'),
      args: [JSON.stringify({ function_name: functionName, params })]
    };

    const results = await PythonShell.run('game_runner.py', options);
    const result = results.join('');

    try {
      return JSON.parse(result);
    } catch (e) {
      console.error('Error parsing Python output:', e);
      console.error('Raw output:', result);
      return { 
        content: 'Error in game simulation', 
        error: `Failed to parse game output: ${e}. Raw output: ${result.substring(0, 200)}...` 
      };
    }
  } catch (error) {
    console.error('Error executing Python script:', error);
    return { 
      content: 'Game simulation failed', 
      error: `Python execution error: ${error}` 
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
  careerPath: string
): Promise<FinancialGameData> {
  return runGameFunction('initialize_financial_twin_function', {
    career_path: careerPath,
    acknowledge_status: 'Yes'
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
    income,
    expenses,
    savings,
    debt,
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
    level,
    achievements,
    financial_decision: financialDecision
  });
}