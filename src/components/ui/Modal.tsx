'use client';

import { X } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden mx-4"
      >
        {/* Left Column: Image */}
        <div className="relative hidden h-full md:block">
          <Image
            src="/LOGIN_IMAGE.png"
            alt="A person holding a plant"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Column: Form Content */}
        <div className="p-8 md:p-12">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}