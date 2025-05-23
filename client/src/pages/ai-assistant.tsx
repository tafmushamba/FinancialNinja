import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function AiAssistant() {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from the API
  const { data: chatData, isLoading: messagesLoading, refetch } = useQuery({
    queryKey: ['/api/assistant/all-messages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/assistant/all-messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        // Server returns { success, message, messages } format
        return data;
      } catch (error) {
        console.error('Error fetching messages:', error);
        return {
          messages: [
            { 
              sender: 'assistant', 
              content: 'Hello! I\'m your AI financial assistant. How can I help you today?',
              timestamp: new Date().toLocaleTimeString()
            }
          ]
        };
      }
    }
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/assistant/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      // Return the response data
      return response.json();
    },
    onSuccess: (data) => {
      // If the response includes messages, update them directly instead of refetching
      if (data.messages && Array.isArray(data.messages)) {
        // Replace queryClient data with the new messages
        queryClient.setQueryData(['/api/assistant/all-messages'], {
          messages: data.messages
        });
        console.log('Updated messages:', data.messages);
      } else {
        console.log('No messages in response, refetching');
        // Otherwise refetch messages
        refetch();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the message
    sendMessageMutation.mutate(message);
    setShowSuggestions(false);
    setMessage('');
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatData]);

  // Default messages if not loaded yet
  const messages = chatData?.messages || [
    { 
      sender: 'assistant', 
      content: 'Hello! I\'m your AI financial assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ];

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <section className="mb-6">
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="border-b border-dark-600 bg-dark-700">
              <div className="flex items-center">
                <div className="h-12 w-12 mr-3">
                  <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-12 w-12" />
                </div>
                <div>
                  <CardTitle className="text-foreground">MoneyMind Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
                <Badge className="ml-auto bg-green-500/20 text-green-500 border border-green-500/30">
                  <i className="fas fa-circle text-xs mr-1"></i> Online
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 bg-dark-900">
                {messages.map((msg: { sender: string; content: string; timestamp?: string }, i: number) => (
                  <div 
                    key={i} 
                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-neon-green/20 text-white' 
                          : 'bg-dark-700 text-white'
                      }`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-6 w-6 mr-2" />
                          <span className="text-xs font-medium text-neon-green">MoneyMind Assistant</span>
                        </div>
                      )}
                      {msg.content}
                      {msg.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div>
                      )}
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="mb-4 flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-dark-700">
                      <div className="flex items-center mb-2">
                        <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-6 w-6 mr-2" />
                        <span className="text-xs font-medium text-neon-green">MoneyMind Assistant</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="border-t border-dark-600 p-4 bg-dark-800">
              <form onSubmit={handleSubmit} className="w-full flex gap-2">
                <Input 
                  className="flex-1 bg-dark-700 border-dark-600 text-foreground focus-visible:ring-neon-green"
                  placeholder="Ask me anything about finance..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  type="submit"
                  className="bg-neon-green hover:bg-neon-green/80 text-black"
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-paper-plane mr-2"></i>
                  )}
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>

          {showSuggestions && (
            <Card className="mt-4 bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                    onClick={() => setMessage("What's the best way to start investing with £500?")}
                  >
                    Best way to invest £500
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                    onClick={() => setMessage("How do I create a budget?")}
                  >
                    How to create a budget
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                    onClick={() => setMessage("Explain compound interest with an example")}
                  >
                    Explain compound interest
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}