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
  });
  
  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/assistant/message', { message: text });
      return response.json();
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
    <section className="mb-8 animate-fadeIn">
      <Card className="bg-dark-800 border-dark-600">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono font-bold">Financial AI Assistant</CardTitle>
            <span className="bg-neon-green bg-opacity-20 text-neon-green text-xs px-2 py-1 rounded flex items-center">
              <i className="fas fa-circle text-xs mr-1 animate-pulse"></i> Online
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-dark-700 rounded-lg p-4 h-48 overflow-y-auto mb-4">
            {chatData?.messages?.length > 0 ? (
              chatData.messages.map((msg: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-start ${msg.sender === 'assistant' ? '' : 'flex-row-reverse'} mb-4`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full ${
                      msg.sender === 'assistant' 
                        ? 'bg-neon-green bg-opacity-20 mr-3' 
                        : 'bg-neon-purple bg-opacity-20 ml-3'
                    } flex items-center justify-center`}
                  >
                    {msg.sender === 'assistant' ? (
                      <i className="fas fa-robot text-neon-green"></i>
                    ) : (
                      <span className="text-neon-purple text-sm font-bold">JS</span>
                    )}
                  </div>
                  <div 
                    className={`${
                      msg.sender === 'assistant' ? 'bg-dark-600' : 'bg-dark-800'
                    } rounded-lg p-3 max-w-[80%]`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-neon-green bg-opacity-20 flex items-center justify-center mr-3">
                  <i className="fas fa-robot text-neon-green"></i>
                </div>
                <div className="bg-dark-600 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi there! I'm your financial literacy assistant. What financial topic would you like to learn about today?</p>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex">
            <Input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about any financial topic..." 
              className="flex-1 bg-dark-700 border-dark-600 rounded-l-md focus:border-neon-green"
            />
            <Button 
              type="submit"
              className="bg-neon-green text-black rounded-l-none hover:bg-opacity-80" 
              disabled={sendMessage.isPending}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AiAssistant;
