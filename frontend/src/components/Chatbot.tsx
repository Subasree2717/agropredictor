import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AgroPredictor assistant. I can help you with farming questions, crop recommendations, and agricultural best practices. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  useEffect(() => {
  if (scrollAreaRef.current) {
    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I\'m having trouble processing your request right now.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Chat error",
        description: "Unable to connect to the chatbot service. Please try again.",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, but I\'m currently unable to process your request. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
   <Card className="flex flex-col h-[calc(100vh-150px)]"> {/* adjust height if needed */}
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MessageCircle className="h-5 w-5 text-primary" />
      Agricultural Assistant
    </CardTitle>
    <CardDescription>
      Ask questions about farming, crops, weather, and agricultural best practices
    </CardDescription>
  </CardHeader>

  {/* Use a wrapper to split scrollable area and input */}
  <CardContent className="flex flex-col flex-1 overflow-hidden">
    {/* 🔁 Scrollable Chat Messages */}
    <div className="flex-1 overflow-y-auto pr-4" ref={scrollAreaRef}>
      <div className="space-y-4 pb-4"> {/* Bottom padding for spacing from input */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full ${
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-agricultural-green text-white'
            }`}>
              {message.sender === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-agricultural-light text-foreground'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-agricultural-green text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-agricultural-light p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ✏️ Input Area */}
    <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t mt-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything about farming..."
        disabled={loading}
        className="flex-1"
      />
      <Button type="submit" disabled={loading || !input.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  </CardContent>
</Card>

  );
}