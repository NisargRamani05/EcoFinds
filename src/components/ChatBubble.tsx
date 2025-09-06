'use client';

import { MessageSquare } from 'lucide-react';

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-black text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 z-50"
      aria-label="Open help chat"
    >
      <MessageSquare size={32} />
    </button>
  );
}