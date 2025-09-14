import { useState } from "react";
import { MessageCircle, Search, Phone, Video, MoreVertical, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "online" | "offline" | "away";
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "counselor";
  timestamp: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Clinical Psychologist",
    lastMessage: "How are you feeling after our last session?",
    timestamp: "2 min ago",
    unread: 1,
    status: "online",
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Behavioral Therapist",
    lastMessage: "The breathing exercises we discussed should help...",
    timestamp: "1 hour ago",
    unread: 0,
    status: "away",
    avatar: "MC",
  },
  {
    id: "3",
    name: "Crisis Support Team",
    role: "24/7 Support",
    lastMessage: "We're here if you need anything",
    timestamp: "Yesterday",
    unread: 0,
    status: "online",
    avatar: "CS",
  },
];

const messages: Message[] = [
  {
    id: "1",
    content: "Hi! How are you feeling today?",
    sender: "counselor",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    content: "I've been feeling a bit anxious about my upcoming exams.",
    sender: "user",
    timestamp: "10:02 AM",
  },
  {
    id: "3",
    content: "That's completely understandable. Exam anxiety is very common among students. Let's work through some coping strategies together.",
    sender: "counselor",
    timestamp: "10:05 AM",
  },
  {
    id: "4",
    content: "That would be really helpful, thank you.",
    sender: "user",
    timestamp: "10:06 AM",
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic here
      setMessageInput("");
    }
  };

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Secure communication with your counselors and support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-gradient-card rounded-xl shadow-card border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 border-0 bg-accent-light"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                    selectedConversation.id === conversation.id
                      ? "bg-gradient-primary text-primary-foreground"
                      : "hover:bg-accent-light"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                        selectedConversation.id === conversation.id
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-gradient-calm text-primary-foreground"
                      }`}>
                        {conversation.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium text-sm truncate ${
                          selectedConversation.id === conversation.id ? "text-primary-foreground" : "text-foreground"
                        }`}>
                          {conversation.name}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs truncate ${
                        selectedConversation.id === conversation.id ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}>
                        {conversation.role}
                      </p>
                      <p className={`text-xs truncate mt-1 ${
                        selectedConversation.id === conversation.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-gradient-card rounded-xl shadow-card border border-border flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-gradient-calm rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-semibold text-primary-foreground">
                    {selectedConversation.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(selectedConversation.status)}`}></div>
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground">{selectedConversation.name}</p>
                  <p className="text-xs text-primary-foreground/80">{selectedConversation.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-accent-light text-accent-foreground"
                    } shadow-gentle`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-0 bg-accent-light"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage} variant="chat" disabled={!messageInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}