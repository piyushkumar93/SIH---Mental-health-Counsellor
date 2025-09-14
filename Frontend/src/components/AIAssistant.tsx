import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import aiAssistantImage from "@/assets/ai-assistant.jpg";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const predefinedResponses = [
  "I understand you're going through a difficult time. It's completely normal to feel overwhelmed during your studies. Would you like to talk about what's specifically bothering you?",
  "Thank you for sharing that with me. It takes courage to reach out. Based on what you've told me, here are some coping strategies that might help...",
  "I'm here to listen and support you. Remember, seeking help is a sign of strength, not weakness. Would you like me to help you find campus counseling resources?",
  "That sounds really challenging. Many students experience similar feelings. Let's work together to find some healthy ways to manage this stress.",
  "I want you to know that your feelings are valid. Sometimes talking to a professional counselor can provide additional support. Would you like information about booking an appointment?",
];

const quickSuggestions = [
  "I'm feeling overwhelmed with studies",
  "How can I manage anxiety?",
  "I need help with stress",
  "Tell me about campus resources",
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI mental health companion. I'm here to provide support, coping strategies, and help you connect with resources. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-card rounded-xl shadow-card border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-calm rounded-t-xl">
        <div className="relative">
          <img
            src={aiAssistantImage}
            alt="AI Assistant"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/20"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-gentle-bounce"></div>
        </div>
        <div>
          <h3 className="font-semibold text-primary-foreground">AI Support Assistant</h3>
          <p className="text-xs text-primary-foreground/80">Here to help 24/7</p>
        </div>
        <Sparkles className="h-5 w-5 text-primary-foreground/60 ml-auto" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-primary text-primary-foreground ml-auto"
                    : "bg-accent-light text-accent-foreground"
                } shadow-gentle`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-accent-light p-3 rounded-2xl shadow-gentle">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="soft"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share how you're feeling..."
            className="flex-1 rounded-full border-0 bg-accent-light focus:ring-2 focus:ring-primary/20"
            disabled={isTyping}
          />
          <Button
            type="submit"
            variant="chat"
            size="chat"
            disabled={!inputValue.trim() || isTyping}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}