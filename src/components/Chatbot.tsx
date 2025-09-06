'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import { X, Send, Bot } from 'lucide-react'; // Import the Bot icon

// Define the structure of a message
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

const WELCOME_MESSAGE: Message = {
    id: 'initial-welcome',
    role: 'assistant',
    content: "Hi! I'm the EcoFinds assistant. How can I help you today? You can ask me about listing products, our policies, or anything else about the platform."
};


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get response from bot:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* The Chat Window with Animation */}
      <div 
        className={`fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[60vh] sm:h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        {/* Enhanced Header */}
        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot size={24} />
            <h2 className="font-bold text-lg">EcoFinds Help</h2>
          </div>
          <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="hover:opacity-75 transition-opacity">
            <X size={24} />
          </button>
        </div>
        
        {/* Messages with Custom Scrollbar */}
        <div className="flex-1 p-4 overflow-y-auto chat-messages">
          {messages.map((m) => {
            const messageClasses = {
              user: 'bg-gray-200 text-gray-900',
              assistant: 'bg-gray-100 text-gray-900',
              error: 'bg-red-100 text-red-800 font-medium',
            };
            const alignmentClass = m.role === 'user' ? 'justify-end' : 'justify-start';

            return (
              <div key={m.id} className={`flex my-2 ${alignmentClass}`}>
                <div className={`p-3 rounded-lg max-w-xs ${messageClasses[m.role]}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            );
          })}
          {/* New Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
                <div className="p-3 rounded-lg max-w-xs bg-gray-100">
                    <div className="flex items-center justify-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex items-center">
            <input
              className="input-style flex-1 !mt-0"
              value={input}
              placeholder="Ask a question..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="ml-2 p-2 bg-black text-white rounded-full transition-opacity hover:opacity-80 disabled:opacity-50" aria-label="Send message" disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
      
      {/* The floating bubble button */}
      <ChatBubble onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}