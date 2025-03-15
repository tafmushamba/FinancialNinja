import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QuizQuestion, Quiz } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Zap, 
  Trophy, 
  Brain, 
  Lightbulb, 
  BarChart4,
  Flame
} from 'lucide-react';

type QuizProps = {
  quizId: number;
  onComplete?: (score: number, passed: boolean) => void;
};

type AnswerState = {
  [questionId: number]: string;
};

type QuestionWithOptions = QuizQuestion & {
  options: { id: string; text: string; isCorrect: boolean }[];
};

// Additional types for gamification
type QuestionPoints = {
  [questionId: number]: {
    basePoints: number;
    timeBonus: number;
    streakBonus: number;
    difficultyMultiplier: number;
    total: number;
  }
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

// Define achievements
const QUIZ_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete the quiz in record time',
    icon: <Clock className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Answer all questions correctly',
    icon: <Trophy className="w-5 h-5 text-yellow-500" />
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Answer 3 or more questions correctly in a row',
    icon: <Flame className="w-5 h-5 text-orange-500" />
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Pass the quiz after a previous failure',
    icon: <Award className="w-5 h-5 text-purple-500" />
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete all quiz questions',
    icon: <Brain className="w-5 h-5 text-green-500" />
  }
];

export function QuizInterfaceEnhanced({ quizId, onComplete }: QuizProps) {
  // Quiz state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<{
    score: number;
    passed: boolean;
    feedback: { [questionId: number]: { correct: boolean; explanation: string } };
  } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Gamification state
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // 60 seconds per question
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [pointsBreakdown, setPointsBreakdown] = useState<QuestionPoints>({});
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [questionPoints, setQuestionPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [previousAttempts, setPreviousAttempts] = useState<number>(0);
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Get difficulty multiplier for points
  const getDifficultyMultiplier = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 1.5;
      case 'hard': return 2;
      default: return 1;
    }
  };

  // Calculate time bonus based on how quickly a question is answered
  const calculateTimeBonus = (timeRemaining: number): number => {
    if (timeRemaining > 45) return 20; // Very fast (75% of time remaining)
    if (timeRemaining > 30) return 15; // Fast (50% of time remaining)
    if (timeRemaining > 15) return 10; // Moderate (25% of time remaining)
    return 0; // Slow (no bonus)
  };

  // Calculate streak bonus
  const calculateStreakBonus = (streak: number): number => {
    if (streak >= 5) return 25; // 5+ streak
    if (streak >= 3) return 15; // 3-4 streak
    if (streak >= 2) return 5;  // 2 streak
    return 0;                   // No streak
  };

  // Check and update achievements
  const checkAchievements = (
    score: number, 
    maxStreak: number, 
    timeTaken: number,
    previousAttempts: number
  ): Achievement[] => {
    const newAchievements: Achievement[] = [];
    
    // Perfect score achievement
    if (score === 100) {
      newAchievements.push(QUIZ_ACHIEVEMENTS[1]);
    }
    
    // Streak master achievement
    if (maxStreak >= 3) {
      newAchievements.push(QUIZ_ACHIEVEMENTS[2]);
    }
    
    // Speed demon achievement (complete in less than 20 seconds per question on average)
    const averageTimePerQuestion = timeTaken / questions.length;
    if (averageTimePerQuestion < 20 && questions.length > 1) {
      newAchievements.push(QUIZ_ACHIEVEMENTS[0]);
    }
    
    // Comeback kid achievement
    if (previousAttempts > 0) {
      newAchievements.push(QUIZ_ACHIEVEMENTS[3]);
    }
    
    // Knowledge seeker achievement (complete all questions)
    if (questions.length > 0 && questions.every(q => answers[q.id] !== undefined)) {
      newAchievements.push(QUIZ_ACHIEVEMENTS[4]);
    }
    
    return newAchievements;
  };

  // Setup timer for each question
  useEffect(() => {
    if (questions[currentQuestionIndex] && !isReviewing) {
      // Reset timer when question changes
      setTimeRemaining(60);
      setQuestionStartTime(new Date());
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start new timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - clear interval
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, isReviewing, questions]);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiRequest<{
          quiz: Quiz;
          questions: QuestionWithOptions[];
        }>({
          url: `/api/quizzes/${quizId}`,
          method: 'GET',
        });

        if (response && response.quiz) {
          setQuiz(response.quiz);
          setQuestions(response.questions);
          setStartTime(new Date());
          setQuestionStartTime(new Date());
          
          // Attempt to fetch previous attempts
          try {
            const attemptHistory = await apiRequest<{
              attempts: any[];
            }>({
              url: `/api/quizzes/${quizId}/attempts`,
              method: 'GET',
            });
            
            if (attemptHistory && attemptHistory.attempts) {
              setPreviousAttempts(attemptHistory.attempts.length);
            }
          } catch (error) {
            console.log('No previous attempts found');
          }
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load the quiz. Please try again later.',
        });
      }
    };

    fetchQuiz();
  }, [quizId, toast]);

  // Computed values
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => answers[q.id] !== undefined);

  // Handle an answer selection
  const handleAnswer = (questionId: number, optionId: string) => {
    // Stop the timer when an answer is selected
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Store the answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
    
    if (!currentQuestion) return;
    
    // Find the selected option
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;
    
    // Calculate points for this question
    const basePoints = currentQuestion.points || 10;
    const timeBonus = calculateTimeBonus(timeRemaining);
    const streakBonus = calculateStreakBonus(currentStreak);
    const difficultyMultiplier = getDifficultyMultiplier(difficultyLevel);
    
    const total = Math.round((basePoints + timeBonus + streakBonus) * difficultyMultiplier);
    
    // Update points breakdown
    setPointsBreakdown(prev => ({
      ...prev,
      [questionId]: {
        basePoints,
        timeBonus,
        streakBonus,
        difficultyMultiplier,
        total
      }
    }));
    
    // Update total points
    setTotalPoints(prev => prev + total);
    
    // Set question points for animation
    setQuestionPoints(total);
    
    // Update streak
    if (selectedOption.isCorrect) {
      setCurrentStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, currentStreak + 1));
    } else {
      setCurrentStreak(0);
    }
    
    // Show feedback for a moment
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500);
  };
  
  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit the quiz
  const handleSubmit = async () => {
    if (!quiz || !startTime) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate time taken in seconds
      const endTime = new Date();
      const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      
      // Convert answers to format expected by API
      const selectedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        selectedOptions: [optionId],
      }));
      
      const response = await apiRequest<{
        score: number;
        passed: boolean;
        feedback: { [questionId: number]: { correct: boolean; explanation: string } };
        attemptId: number;
      }>({
        url: `/api/quizzes/${quizId}/attempt`,
        method: 'POST',
        data: {
          answers: selectedAnswers,
          timeTaken,
        },
      });

      if (response && response.score !== undefined) {
        setAttemptResult(response);
        
        // Check achievements
        const newAchievements = checkAchievements(
          response.score, 
          maxStreak, 
          timeTaken,
          previousAttempts
        );
        setEarnedAchievements(newAchievements);
        
        if (onComplete) {
          onComplete(response.score, response.passed);
        }
        
        toast({
          title: response.passed ? 'Quiz Completed!' : 'Quiz Finished',
          description: response.passed 
            ? `Congratulations! You scored ${response.score}% and passed the quiz.` 
            : `You scored ${response.score}%. You need ${quiz.passingScore}% to pass.`,
          variant: response.passed ? 'default' : 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit the quiz. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    setIsReviewing(true);
    setCurrentQuestionIndex(0);
  };

  const handleRetry = () => {
    setAnswers({});
    setAttemptResult(null);
    setIsReviewing(false);
    setCurrentQuestionIndex(0);
    setStartTime(new Date());
    setTotalPoints(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setEarnedAchievements([]);
  };
  
  // Change difficulty level
  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard') => {
    setDifficultyLevel(level);
    toast({
      title: `Difficulty set to ${level}`,
      description: `Point multiplier: ${getDifficultyMultiplier(level)}x`,
    });
  };

  // Loading state
  if (!quiz || questions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 rounded-full bg-slate-700"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results screen
  if (attemptResult && !isReviewing) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>{quiz.title} - Results</CardTitle>
          <CardDescription>
            You scored {attemptResult.score}% on this quiz
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Progress value={attemptResult.score} className="h-2" />
            
            <Alert variant={attemptResult.passed ? "default" : "destructive"}>
              <AlertTitle>
                {attemptResult.passed ? "Congratulations!" : "Almost there!"}
              </AlertTitle>
              <AlertDescription>
                {attemptResult.passed 
                  ? "You've successfully passed this quiz and demonstrated your understanding of the material."
                  : `You need ${quiz.passingScore}% to pass this quiz. Review the material and try again.`}
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Points summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Points Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Points Earned</div>
              <div className="font-bold text-right">{totalPoints}</div>
              <div>Longest Streak</div>
              <div className="font-bold text-right">{maxStreak}</div>
              <div>Difficulty Multiplier</div>
              <div className="font-bold text-right">{getDifficultyMultiplier(difficultyLevel)}x</div>
            </div>
          </div>
          
          {/* Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Achievements Unlocked</h3>
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center p-2 bg-accent rounded-md">
                    <div className="mr-2">{achievement.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReview}>
            Review Answers
          </Button>
          {!attemptResult.passed && (
            <Button onClick={handleRetry}>
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  // Quiz interface
  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1 text-amber-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeRemaining}s</span>
            </div>
            
            {/* Points */}
            <div className="flex items-center gap-1 text-emerald-500">
              <BarChart4 className="w-4 h-4" />
              <span className="text-sm font-medium">{totalPoints}</span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{currentStreak}</span>
            </div>
            
            {/* Difficulty */}
            <Badge variant={
              difficultyLevel === 'easy' ? 'outline' :
              difficultyLevel === 'medium' ? 'secondary' : 'destructive'
            }>
              {difficultyLevel}
            </Badge>
          </div>
        </div>
        
        {/* Difficulty selection */}
        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant={difficultyLevel === 'easy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDifficultyChange('easy')}
            className="h-7 px-2"
          >
            Easy
          </Button>
          <Button
            variant={difficultyLevel === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDifficultyChange('medium')}
            className="h-7 px-2"
          >
            Medium
          </Button>
          <Button
            variant={difficultyLevel === 'hard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDifficultyChange('hard')}
            className="h-7 px-2"
          >
            Hard
          </Button>
        </div>
      </CardHeader>
      
      <Progress value={progress} className="h-1" />
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Question text */}
          <div className="text-xl font-medium">{currentQuestion.text}</div>
          
          {/* Point popup animation */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              >
                <div className="flex flex-col items-center p-4 bg-black/80 text-white rounded-lg">
                  <div className="text-2xl font-bold">+{questionPoints} points</div>
                  {pointsBreakdown[currentQuestion.id] && (
                    <div className="text-sm opacity-80">
                      <div>Base: {pointsBreakdown[currentQuestion.id].basePoints}</div>
                      {pointsBreakdown[currentQuestion.id].timeBonus > 0 && (
                        <div>Time Bonus: +{pointsBreakdown[currentQuestion.id].timeBonus}</div>
                      )}
                      {pointsBreakdown[currentQuestion.id].streakBonus > 0 && (
                        <div>Streak Bonus: +{pointsBreakdown[currentQuestion.id].streakBonus}</div>
                      )}
                      <div>Multiplier: {pointsBreakdown[currentQuestion.id].difficultyMultiplier}x</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Options */}
          <RadioGroup 
            value={answers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center space-x-2 rounded-md border p-3 ${
                  isReviewing && attemptResult ? 
                    option.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' :
                    answers[currentQuestion.id] === option.id && !option.isCorrect ? 
                      'border-red-500 bg-red-50 dark:bg-red-950' : ''
                  : ''
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`option-${currentQuestion.id}-${option.id}`} 
                  disabled={isReviewing}
                />
                <Label 
                  htmlFor={`option-${currentQuestion.id}-${option.id}`}
                  className={`flex-grow ${
                    isReviewing && option.isCorrect ? 'text-green-700 dark:text-green-400 font-medium' : ''
                  }`}
                >
                  {option.text}
                </Label>
                {isReviewing && option.isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
                {isReviewing && !option.isCorrect && answers[currentQuestion.id] === option.id && (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </motion.div>
            ))}
          </RadioGroup>
          
          {/* Explanation during review */}
          {isReviewing && attemptResult && attemptResult.feedback[currentQuestion.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Separator className="my-4" />
              <div className="text-sm font-medium mb-2">Explanation:</div>
              <div className="text-sm text-muted-foreground">
                {attemptResult.feedback[currentQuestion.id].explanation}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {!isLastQuestion ? (
            <Button 
              onClick={handleNext} 
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          ) : (
            isReviewing ? (
              <Button 
                onClick={handleRetry}
                variant="outline"
              >
                Retry Quiz
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!allQuestionsAnswered || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}