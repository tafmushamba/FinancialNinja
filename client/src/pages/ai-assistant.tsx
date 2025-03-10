import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';

export default function AiAssistant() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI financial assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'm simulating a response to "${message}". In a real implementation, this would call an API to get a proper AI response.` 
      }]);
      setLoading(false);
      setMessage('');
    }, 1000);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Header title="AI Assistant" />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <section className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">AI Financial Assistant</h1>
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader className="border-b border-dark-600 bg-dark-700">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 bg-neon-green/20">
                    <i className="fas fa-robot text-neon-green"></i>
                  </Avatar>
                  <div>
                    <CardTitle className="text-foreground">FinByte Assistant</CardTitle>
                    <p className="text-xs text-muted-foreground">Powered by AI</p>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-500 border border-green-500/30">
                    <i className="fas fa-circle text-xs mr-1"></i> Online
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-4 bg-dark-900">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-neon-green/20 text-white' 
                            : 'bg-dark-700 text-white'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="mb-4 flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-dark-700">
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
                  />
                  <Button 
                    type="submit"
                    className="bg-neon-green hover:bg-neon-green/80 text-black"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
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
    </>
  );
}