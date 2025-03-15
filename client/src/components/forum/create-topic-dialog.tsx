import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { ForumCategory } from './forum-types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CreateTopicDialogProps {
  category: ForumCategory;
  onSuccess?: () => void;
}

export default function CreateTopicDialog({ category, onSuccess }: CreateTopicDialogProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTopic = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide both title and content for your topic",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiRequest<{ topic: { id: number; slug: string } }>({
        url: '/api/forum/topics',
        method: 'POST',
        data: {
          title,
          content,
          categoryId: category.id
        }
      });

      toast({
        title: "Success",
        description: "Your topic has been created successfully",
      });

      setIsOpen(false);
      setTitle('');
      setContent('');

      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the new topic page
        setLocation(`/forum/topics/${response.topic.id}`);
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a New Topic</DialogTitle>
          <DialogDescription>
            Start a new discussion in the {category.name} category
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic-title">Topic Title</Label>
            <Input
              id="topic-title"
              placeholder="Enter a descriptive title for your topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-content">Content</Label>
            <Textarea
              id="topic-content"
              placeholder="Share your thoughts, questions, or insights..."
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleCreateTopic} 
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Topic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}