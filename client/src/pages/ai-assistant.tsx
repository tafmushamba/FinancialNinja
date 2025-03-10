import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TerminalText from '@/components/ui/terminal-text';

const AiAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: chatData } = useQuery({
    queryKey: ['/api/assistant/all-messages'],
  });
  
  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/assistant/message', { message: text });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assistant/all-messages'] });
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
      setMessage('');
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData]);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="AI Assistant" />
        
        <div className="p-4 md:p-6">
          <section className="mb-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-mono font-bold mb-4 md:mb-0">
                <TerminalText>Financial AI Assistant</TerminalText>
              </h1>
              
              <Card className="bg-dark-800 border-dark-600 p-3 w-full md:w-auto">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-neon-green bg-opacity-20 flex items-center justify-center mb-1 mx-auto">
                      <i className="fas fa-robot text-neon-green"></i>
                    </div>
                    <p className="text-xs text-gray-400">Ask</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-neon-cyan bg-opacity-20 flex items-center justify-center mb-1 mx-auto">
                      <i className="fas fa-lightbulb text-neon-cyan"></i>
                    </div>
                    <p className="text-xs text-gray-400">Learn</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-neon-purple bg-opacity-20 flex items-center justify-center mb-1 mx-auto">
                      <i className="fas fa-calculator text-neon-purple"></i>
                    </div>
                    <p className="text-xs text-gray-400">Calculate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-neon-yellow bg-opacity-20 flex items-center justify-center mb-1 mx-auto">
                      <i className="fas fa-chart-line text-neon-yellow"></i>
                    </div>
                    <p className="text-xs text-gray-400">Analyze</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono">Chat with FinByte AI</CardTitle>
                  <span className="bg-neon-green bg-opacity-20 text-neon-green text-xs px-2 py-1 rounded flex items-center">
                    <i className="fas fa-circle text-xs mr-1 animate-pulse"></i> Online
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-dark-700 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                  {chatData?.messages?.length > 0 ? (
                    chatData.messages.map((msg: any, index: number) => (
                      <div 
                        key={index} 
                        className={`flex items-start ${msg.sender === 'assistant' ? '' : 'flex-row-reverse'} mb-6`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full ${
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
                          } rounded-lg p-4 max-w-[75%]`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          {msg.timestamp && (
                            <p className="text-xs text-gray-400 mt-2">{msg.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-neon-green bg-opacity-20 flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-neon-green"></i>
                      </div>
                      <div className="bg-dark-600 rounded-lg p-4 max-w-[75%]">
                        <p className="text-sm">
                          Hello! I'm your financial literacy assistant. I can answer your questions about
                          personal finance, investing, budgeting, or any other financial topics. How can I help you today?
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="flex">
                  <Input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about any financial topic..." 
                    className="flex-1 bg-dark-700 border-dark-600 rounded-r-none focus:border-neon-green"
                  />
                  <Button 
                    type="submit"
                    className="bg-neon-green text-black rounded-l-none hover:bg-opacity-80" 
                    disabled={sendMessage.isPending}
                  >
                    <i className={sendMessage.isPending ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                  </Button>
                </form>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-400">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                      onClick={() => setMessage("What's the best way to start investing with little money?")}
                    >
                      How to start investing with little money?
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                      onClick={() => setMessage("How do I create an emergency fund?")}
                    >
                      How to create an emergency fund?
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-dark-700 border-dark-600 hover:bg-dark-600 hover:text-white"
                      onClick={() => setMessage("Explain compound interest with an example")}
                    >
                      Explain compound interest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default AiAssistant;
