/**
 * Financial Game Service
 * Provides integration with the Python Financial Twin game
 */
import { PythonShell } from 'python-shell';
import { log } from '../vite';
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
    // Setup Python Shell options
    const options = {
      mode: 'text' as const,
      pythonPath: 'python3',
      pythonOptions: ['-u'], // unbuffered output
      scriptPath: './',
      args: [functionName, JSON.stringify(params)]
    };

    // Run the Python script
    const results = await PythonShell.run('python_modules/game_runner.py', options);
    
    // Parse the result (should be a JSON string)
    const result = results.join('');
    
    try {
      return JSON.parse(result) as FinancialGameData;
    } catch (e) {
      log(`Error parsing Python result: ${e}`);
      return { 
        content: "There was an error processing your request.",
        error: `Failed to parse result: ${result}`
      };
    }
  } catch (error) {
    log(`Error running Python script: ${error}`);
    return { 
      content: "There was an error running the game.",
      error: `${error}`
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
  return runGameFunction('welcome', {
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
  return runGameFunction('initialize', {
    career_path: careerPath,
    acknowledge_status: true
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
  nextStep: 'Continue with next scenario' | 'End session'
): Promise<FinancialGameData> {
  return runGameFunction('process_decision', {
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
  return runGameFunction('conclude', {
    player_name: playerName,
    career_path: careerPath,
    xp_earned: xpEarned,
    level,
    achievements,
    financial_decision: financialDecision
  });
}