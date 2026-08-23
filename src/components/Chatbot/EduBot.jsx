import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSmartResponse } from './botKnowledge';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ChevronDown, 
  MessageSquare, 
  CornerDownLeft,
  GraduationCap,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function EduBot() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 Namaste ${currentUser?.name?.split(' ')[0] || 'Scholar'}! Main hoon EduBot 🤖 — Aapka Intelligent Campus AI Companion.\n\nAap mujhse BLE attendance, Virtual ID pass, anonymous grievances, notes vault, ya classroom maintenance ke baare me kuch bhi pooch sakte hain!`,
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    '📍 Attendance kaise lagaye?',
    '💳 Virtual ID pass scan nahi ho raha',
    '⚖️ Teacher ko anonymous complaint',
    '🛠️ AC kharab hai lab me',
    '📚 Notes & Syllabus PDF download',
    '💬 1-on-1 private WhatsApp chat'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    setInputMessage('');

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getSmartResponse(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: botReply, time: 'Just now' }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[410px] h-[540px] max-h-[82vh] rounded-3xl bg-white/95 border border-slate-200/90 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fadeIn select-none">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 border-b border-indigo-800 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner border border-white/30">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 tracking-tight">
                  EduBot AI Companion
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h4>
                <p className="text-[10px] text-indigo-100 font-semibold mt-0.5">
                  Hinglish + English Intelligent NLP • {currentUser?.role ? currentUser.role.toUpperCase() : 'CAMPUS'} MODE
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
              title="Close EduBot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area with complete text wrapping */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/80 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-semibold rounded-tr-none shadow-md shadow-indigo-600/20'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none leading-relaxed shadow-xs'
                }`}>
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed text-xs">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-400 font-semibold ml-1">EduBot is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips (Horizontal Scroll Container) */}
          <div className="p-2 bg-slate-100/90 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 text-[11px] whitespace-nowrap transition font-bold border border-slate-200 shadow-2xs shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything in English ya Hinglish..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 focus:outline-none placeholder-slate-400 transition shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition shadow-md shadow-indigo-600/25"
              title="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-105 border border-white/20"
      >
        <Bot className="w-6 h-6 animate-pulse text-amber-300" />
        <span className="text-xs font-black hidden sm:inline tracking-tight">Ask EduBot AI</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></span>
      </button>

    </div>
  );
}
