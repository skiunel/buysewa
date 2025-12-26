import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface CustomerSupportProps {
  className?: string;
}

export function CustomerSupport({ className }: CustomerSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        text: 'Hello! Welcome to BUYSEWA. How can I help you today? I can assist with product information, orders, reviews, and more.',
        sender: 'bot',
        timestamp: new Date()
      }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate response based on user input
    setTimeout(() => {
      const botResponse = generateResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Product queries
    if (lowerInput.includes('product') || lowerInput.includes('item') || lowerInput.includes('buy')) {
      return 'I can help you find products! You can browse our catalog by category: Electronics, Fashion, Home & Living, Sports & Fitness, and Books. Would you like to search for a specific product?';
    }

    // Order queries
    if (lowerInput.includes('order') || lowerInput.includes('purchase') || lowerInput.includes('bought')) {
      return 'To check your orders, go to "My Account" → "My Orders". You can track your order status, view order details, and get your SDC (Secure Delivery Code) for leaving reviews. Need help with a specific order?';
    }

    // Review queries
    if (lowerInput.includes('review') || lowerInput.includes('rating') || lowerInput.includes('feedback')) {
      return 'Our review system uses blockchain verification! After your order is delivered, you\'ll receive an SDC code. Use this code to submit a verified review that\'s stored on the blockchain. This ensures only real buyers can review products.';
    }

    // Payment queries
    if (lowerInput.includes('payment') || lowerInput.includes('pay') || lowerInput.includes('esewa') || lowerInput.includes('khalti')) {
      return 'We accept multiple payment methods: eSewa, Khalti, Credit/Debit Cards, and Cash on Delivery. All payments are secure and encrypted. For eSewa, you\'ll be redirected to their secure payment page.';
    }

    // Shipping queries
    if (lowerInput.includes('shipping') || lowerInput.includes('delivery') || lowerInput.includes('ship')) {
      return 'We offer free delivery on orders over NPR 5,000. Standard delivery takes 2-3 business days. Once your order is delivered, you\'ll receive an SDC code via email for leaving verified reviews.';
    }

    // Blockchain queries
    if (lowerInput.includes('blockchain') || lowerInput.includes('sdc') || lowerInput.includes('verify')) {
      return 'Our blockchain system ensures review authenticity! When you receive your order, you get an SDC (Secure Delivery Code). This code is registered on the blockchain and allows you to submit verified reviews. Reviews are stored on-chain for transparency and security.';
    }

    // Account queries
    if (lowerInput.includes('account') || lowerInput.includes('profile') || lowerInput.includes('login')) {
      return 'You can manage your account from "My Account" dashboard. There you can view orders, update profile, manage addresses, and see your review history. Need help with account settings?';
    }

    // Return queries
    if (lowerInput.includes('return') || lowerInput.includes('refund') || lowerInput.includes('exchange')) {
      return 'We offer easy returns within 30 days of delivery. Go to "My Orders" → Select your order → Click "Return". Our team will process your return request. For refunds, the amount will be credited back to your original payment method.';
    }

    // Greeting
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return 'Hello! Welcome to BUYSEWA! I\'m here to help you with shopping, orders, reviews, payments, and more. What would you like to know?';
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return 'I can help you with:\n• Finding products\n• Order tracking\n• Payment methods\n• Review system\n• Shipping information\n• Account management\n• Returns and refunds\n\nWhat do you need help with?';
    }

    // Default response
    return 'I understand you\'re asking about: "' + userInput + '". I can help you with product information, orders, payments, reviews, shipping, and account management. Could you be more specific about what you need?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[#003366] hover:bg-[#002244] text-white shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-96 shadow-2xl flex flex-col ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-[#003366] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-gray-200">We're here to help</p>
              </div>
            </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user'
                          ? 'bg-[#003366] text-white'
                          : 'bg-[#00CC99] text-white'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-[#003366] text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="h-8 w-8 rounded-full bg-[#00CC99] text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#003366] hover:bg-[#002244] text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs"
                  onClick={() => setInput('How do I place an order?')}
                >
                  Place Order
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs"
                  onClick={() => setInput('How does the review system work?')}
                >
                  Reviews
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs"
                  onClick={() => setInput('What payment methods do you accept?')}
                >
                  Payments
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs"
                  onClick={() => setInput('How does blockchain verification work?')}
                >
                  Blockchain
                </Badge>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}


