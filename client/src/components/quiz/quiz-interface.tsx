import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { QuizQuestion, Quiz } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

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

export function QuizInterface({ quizId, onComplete }: QuizProps) {
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
  const { toast } = useToast();

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

        if (response) {
          setQuiz(response.quiz);
          setQuestions(response.questions);
          setStartTime(new Date());
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

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (questionId: number, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

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
      }>({
        url: `/api/quizzes/${quizId}/attempt`,
        method: 'POST',
        data: {
          answers: selectedAnswers,
          timeTaken,
        },
      });

      if (response) {
        setAttemptResult(response);
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
  };

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

  if (attemptResult && !isReviewing) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>{quiz.title} - Results</CardTitle>
          <CardDescription>
            You scored {attemptResult.score}% on this quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className="text-sm text-muted-foreground">
            Passing score: {quiz.passingScore}%
          </div>
        </div>
      </CardHeader>
      
      <Progress value={progress} className="h-1" />
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-xl font-medium">{currentQuestion.text}</div>
          
          <RadioGroup 
            value={answers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div 
                key={option.id} 
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
                  <div className="text-green-600 dark:text-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
          
          {isReviewing && attemptResult && attemptResult.feedback[currentQuestion.id] && (
            <div className="mt-4">
              <Separator className="my-4" />
              <div className="text-sm font-medium mb-2">Explanation:</div>
              <div className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </div>
            </div>
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