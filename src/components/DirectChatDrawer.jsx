import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  X, 
  Send, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  User, 
  Clock, 
  Paperclip,
  Phone,
  Video,
  Smile,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function DirectChatDrawer() {
  const { currentUser } = useAuth();
  const { 
    directMessages, 
    activeChatPartner, 
    isChatDrawerOpen, 
    closeDirectChat, 
    sendDirectMessage,
    deleteDirectMessage
  } = useData();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  const quickChips = [
    'Good afternoon professor, regarding lab practical...',
    'Is consultation available at your cabin today?',
    'Please review the updated submission file.',
    'Thank you, noted!'
  ];

  // Filter messages between currentUser and activeChatPartner
  const conversation = directMessages.filter(m => {
    if (!activeChatPartner || !currentUser) return false;
    const currentId = currentUser.id || currentUser.enrollment;
    const partnerId = activeChatPartner.id || activeChatPartner.enrollment;
    
    return (
      (m.senderId === currentId && m.receiverId === partnerId) ||
      (m.senderId === partnerId && m.receiverId === currentId)
    );
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatDrawerOpen) {
      scrollToBottom();
    }
  }, [conversation, isChatDrawerOpen]);

  if (!isChatDrawerOpen || !activeChatPartner) return null;

  const handleSend = async (textToSend = inputMsg) => {
    if (!textToSend.trim()) return;
    setInputMsg('');
    await sendDirectMessage(textToSend, currentUser, activeChatPartner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs animate-fadeIn p-2 sm:p-4">
      <div className="w-full max-w-md h-[92vh] max-h-[700px] bg-[#efeae2] rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden relative animate-slideLeft">
        
        {/* WhatsApp-Style Dark Green/Indigo Header */}
        <div className="p-3.5 px-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeChatPartner.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                alt={activeChatPartner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-sm"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white absolute bottom-0 right-0"></span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                <span>{activeChatPartner.name}</span>
              </h4>
              <p className="text-[10px] text-emerald-200 font-medium">
                {activeChatPartner.designation || activeChatPartner.role?.toUpperCase()} • {activeChatPartner.cabin || activeChatPartner.department || 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
              E2E Encrypted
            </span>
            <button
              onClick={closeDirectChat}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body with WhatsApp Wallpaper Pattern */}
        <div 
          className="flex-1 p-4 overflow-y-auto space-y-2.5 text-xs bg-[#efeae2]/90"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
            backgroundSize: '18px 18px'
          }}
        >
          {/* Security Notice Pill */}
          <div className="flex justify-center my-2">
            <span className="text-[10px] bg-amber-100/90 text-amber-900 px-3 py-1 rounded-xl shadow-xs border border-amber-200 text-center max-w-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700 flex-shrink-0" />
              Direct messages are confidential & logged for official academic record.
            </span>
          </div>

          {conversation.length === 0 ? (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <p className="text-xs font-semibold">No past messages with {activeChatPartner.name}.</p>
              <p className="text-[11px]">Send a message or pick a quick prompt below to start the conversation!</p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isMe = (msg.senderId === (currentUser?.id || currentUser?.enrollment));

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                  <div 
                    className={`max-w-[80%] p-2.5 px-3.5 rounded-2xl shadow-xs relative transition ${
                      isMe 
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60' 
                        : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                    }`}
                  >
                    <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">{msg.message}</p>
                    
                    <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] text-slate-400 select-none">
                      <span>{msg.timestamp || 'Just now'}</span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      )}
                      <button
                        onClick={() => deleteDirectMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition ml-1"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-white/95 border-t border-slate-200 flex overflow-x-auto gap-1.5 scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] whitespace-nowrap transition font-medium border border-slate-200"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={`Message ${activeChatPartner.name?.split(' ')[0]}...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
