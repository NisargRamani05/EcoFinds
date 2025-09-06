'use client';

// Using a standard <img> tag instead of Next.js Image component to resolve the error.

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-transparent w-16 h-16 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 z-50"
      aria-label="Open help chat"
    >
      <img
        src="/Chat.gif" 
        alt="Chatbot icon"
        width={64}
        height={64}
        className="rounded-full"
      />
    </button>
  );
}

