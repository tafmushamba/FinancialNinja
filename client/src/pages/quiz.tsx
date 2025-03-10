import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizInterface } from '@/components/quiz/quiz-interface';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const quizId = parseInt(id || '0');
  
  // Get the referrer URL from the location state if available
  const location = useLocation();
  const state = location[1] && (location[1] as any).state;
  const returnUrl = state?.returnUrl || '/learning-modules';
  const lessonId = state?.lessonId;
  
  if (!quizId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <p className="mb-6">The quiz you're looking for doesn't exist or the ID is invalid.</p>
          <Button asChild>
            <Link href="/learning-modules">Return to Learning Modules</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleQuizComplete = (score: number, passed: boolean) => {
    // If this quiz is part of a lesson, we could update the user's progress here
    if (lessonId) {
      // In a real app, we would make an API call to update the user's progress
      console.log(`Quiz completed for lesson ${lessonId} with score ${score}, passed: ${passed}`);
      
      // Invalidate any related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/learning/modules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/recommendations'] });
      
      if (passed) {
        toast({
          title: "Progress Updated",
          description: "Your lesson progress has been updated.",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => setLocation(returnUrl)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <QuizInterface 
        quizId={quizId} 
        onComplete={handleQuizComplete}
      />
    </div>
  );
}