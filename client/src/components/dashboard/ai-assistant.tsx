import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';

const AiAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  
  const { data: chatData } = useQuery({
    queryKey: ['/api/assistant/messages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/assistant/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch chat messages');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        return {
          messages: [
            {
              sender: 'assistant',
              content: 'Hi there! I\'m your financial literacy assistant. What financial topic would you like to learn about today?'
            }
          ]
        };
      }
    }
  });
  
  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      return apiRequest({
        url: '/api/assistant/message',
        method: 'POST',
        data: { message: text }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assistant/messages'] });
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
      setMessage('');
    }
  };
  
  return (
    <section className="mb-8 animate-fadeIn px-4">
      <Card className="bg-dark-800 border border-dark-600 shadow-lg hover:shadow-neon-green/20 transition-shadow hover:border-neon-green/30 overflow-hidden glow-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono font-bold text-foreground flex items-center">
              <i className="fas fa-robot text-neon-green mr-2"></i>
              Financial AI Assistant
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="bg-neon-green/20 text-neon-green text-xs px-2 py-1 rounded-md flex items-center shadow-sm">
                <i className="fas fa-circle text-xs mr-1 animate-pulse"></i> Online
              </span>
              <span className="bg-dark-700 text-muted-foreground text-xs px-2 py-1 rounded-md flex items-center shadow-inner">
                <i className="fas fa-code-branch text-xs mr-1"></i> GPT-4 Financial
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="bg-dark-700 rounded-lg p-4 h-64 overflow-y-auto mb-4 border border-dark-600 shadow-inner scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-dark-600">
            {chatData?.messages?.length > 0 ? (
              chatData.messages.map((msg: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-start ${msg.sender === 'assistant' ? '' : 'flex-row-reverse'} mb-4`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full ${
                      msg.sender === 'assistant' 
                        ? 'bg-neon-green/20 mr-3 shadow-neon-green/20' 
                        : 'bg-neon-purple/20 ml-3 shadow-neon-purple/20'
                    } flex items-center justify-center border border-dark-600 shadow-lg`}
                  >
                    {msg.sender === 'assistant' ? (
                      <i className="fas fa-robot text-neon-green"></i>
                    ) : (
                      <span className="text-neon-purple text-sm font-bold">YOU</span>
                    )}
                  </div>
                  <div 
                    className={`${
                      msg.sender === 'assistant' 
                        ? 'bg-dark-600 border border-dark-700 text-foreground' 
                        : 'bg-dark-800 border border-neon-purple/20 text-foreground'
                    } rounded-lg p-3 max-w-[80%] shadow-sm relative`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="absolute -left-2 top-3 w-2 h-2 bg-dark-600 border-l border-t border-dark-700 transform rotate-45"></div>
                    )}
                    {msg.sender !== 'assistant' && (
                      <div className="absolute -right-2 top-3 w-2 h-2 bg-dark-800 border-r border-t border-neon-purple/20 transform rotate-45"></div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center mr-3 border border-dark-600 shadow-neon-green/20">
                  <i className="fas fa-robot text-neon-green"></i>
                </div>
                <div className="bg-dark-600 border border-dark-700 rounded-lg p-3 max-w-[80%] shadow-sm relative">
                  <div className="absolute -left-2 top-3 w-2 h-2 bg-dark-600 border-l border-t border-dark-700 transform rotate-45"></div>
                  <p className="text-sm text-foreground">Hi there! I'm your financial literacy assistant. What financial topic would you like to learn about today?</p>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex mt-4 relative">
            <div className="absolute -top-8 right-0 text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-sparkles text-neon-green"></i>
                  <span>Financial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-chart-pie text-neon-cyan"></i>
                  <span>Investment</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-graduation-cap text-neon-purple"></i>
                  <span>Education</span>
                </div>
              </div>
            </div>
            
            <Input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about any financial topic..." 
              className="flex-1 bg-dark-700 border-dark-600 rounded-l-md focus-visible:ring-neon-green/30 focus-visible:border-neon-green/30 shadow-inner"
            />
            <Button 
              type="submit"
              className="bg-neon-green text-black rounded-l-none hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/20" 
              disabled={sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AiAssistant;
