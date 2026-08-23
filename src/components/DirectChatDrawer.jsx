import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { sounds } from '../utils/soundEffects';
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
  Building,
  Search,
  Users,
  MessageCircle,
  FileText,
  Check
} from 'lucide-react';

export default function DirectChatDrawer() {
  const { currentUser } = useAuth();
  const { 
    directMessages, 
    activeChatPartner, 
    setActiveChatPartner,
    isChatDrawerOpen, 
    closeDirectChat, 
    sendDirectMessage,
    deleteDirectMessage,
    facultyDirectory,
    openDirectChat
  } = useData();

  const [inputMsg, setInputMsg] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [showContactList, setShowContactList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const quickChips = [
    'Good afternoon Professor, regarding tomorrow’s lab practical...',
    'Is consultation available at your cabin today?',
    'Please review the updated submission file.',
    'Thank you, noted!'
  ];

  const { studentsRoster } = useData();

  // Combine contacts across Students and Faculty so all roles can message each other
  const allCampusContacts = [
    ...(studentsRoster || []).map(s => ({
      id: s.roll || s.id || 'STU-001',
      enrollment: s.roll,
      name: s.name,
      role: 'student',
      designation: 'Student Scholar',
      department: 'Computer Science & Engineering (CSE)',
      avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    })),
    ...(facultyDirectory || []).map(f => ({
      ...f,
      role: f.role || (f.id?.startsWith('HOD') ? 'hod' : (f.id?.startsWith('STF') ? 'staff' : 'teacher'))
    }))
  ];

  // Filter contacts by search query & exclude self
  const myCurrentId = currentUser?.id || currentUser?.enrollment;
  const filteredContacts = allCampusContacts.filter(f => 
    f.id !== myCurrentId && f.enrollment !== myCurrentId &&
    (f.name?.toLowerCase().includes(searchContact.toLowerCase()) ||
     f.department?.toLowerCase().includes(searchContact.toLowerCase()) ||
     f.subject?.toLowerCase().includes(searchContact.toLowerCase()) ||
     f.designation?.toLowerCase().includes(searchContact.toLowerCase()))
  );

  // Strict isolation filter: conversation strictly between currentUser and activeChatPartner
  const conversation = directMessages.filter(m => {
    if (!activeChatPartner || !currentUser) return false;
    const myIds = [currentUser.id, currentUser.enrollment, currentUser.email].filter(Boolean);
    const partnerIds = [activeChatPartner.id, activeChatPartner.enrollment, activeChatPartner.email].filter(Boolean);
    const myName = currentUser.name?.toLowerCase().trim();
    const partnerName = activeChatPartner.name?.toLowerCase().trim();

    const targetRecipient = m.recipientId || m.receiverId;
    const targetSender = m.senderId;
    const senderName = m.senderName?.toLowerCase().trim();
    const recipientName = (m.recipientName || m.receiverName || '')?.toLowerCase().trim();

    const isCurrentSender = myIds.includes(targetSender) || (myName && senderName === myName);
    const isPartnerRecipient = partnerIds.includes(targetRecipient) || (partnerName && recipientName === partnerName);

    const isPartnerSender = partnerIds.includes(targetSender) || (partnerName && senderName === partnerName);
    const isCurrentRecipient = myIds.includes(targetRecipient) || (myName && recipientName === myName);

    return (isCurrentSender && isPartnerRecipient) || (isPartnerSender && isCurrentRecipient);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatDrawerOpen) {
      scrollToBottom();
    }
  }, [conversation, isChatDrawerOpen, isTyping]);

  if (!isChatDrawerOpen) return null;

  const handleSend = async (textToSend = inputMsg) => {
    if (!textToSend.trim() && !selectedFile) return;
    const toSend = textToSend.trim();
    setInputMsg('');
    const filePayload = selectedFile ? { ...selectedFile } : null;
    setSelectedFile(null);

    await sendDirectMessage(toSend, currentUser, activeChatPartner, filePayload);

    // Simulate partner typing & response if student chatting with faculty
    if (currentUser?.role === 'student' && activeChatPartner?.role === 'teacher') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }, 1500);
    }
  };

  const handleFileAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        file
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs animate-fadeIn p-2 sm:p-4">
      <div className="w-full max-w-lg h-[92vh] max-h-[740px] bg-[#efeae2] rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden relative animate-slideLeft">
        
        {/* WhatsApp-Style Dark Green/Indigo Header */}
        <div className="p-3.5 px-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {activeChatPartner ? (
              <>
                <div className="relative cursor-pointer" onClick={() => setShowContactList(!showContactList)}>
                  <img
                    src={activeChatPartner.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                    alt={activeChatPartner.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-xs"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white absolute bottom-0 right-0"></span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                    <span>{activeChatPartner.name}</span>
                  </h4>
                  <p className="text-[10px] text-emerald-200 font-medium truncate max-w-[200px]">
                    {isTyping ? (
                      <span className="text-emerald-300 font-bold animate-pulse">typing...</span>
                    ) : (
                      `${activeChatPartner.designation || activeChatPartner.role?.toUpperCase()} • ${activeChatPartner.cabin || activeChatPartner.department || 'Online'}`
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h4 className="text-sm font-bold text-white">Campus Direct Messenger</h4>
                <p className="text-[10px] text-emerald-200">Select a faculty member to chat</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContactList(!showContactList)}
              className={`p-1.5 rounded-xl transition text-xs font-bold flex items-center gap-1 ${
                showContactList ? 'bg-white text-emerald-900' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Contacts list"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contacts</span>
            </button>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
              E2E
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

        {/* Contact Selector Sidebar Overlay */}
        {showContactList && (
          <div className="p-3 bg-white border-b border-slate-200 shadow-md animate-fadeIn space-y-2 max-h-60 overflow-y-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder="Search faculty by name, department, or subject..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="space-y-1">
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => {
                    openDirectChat(contact);
                    setShowContactList(false);
                  }}
                  className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition ${
                    activeChatPartner?.id === contact.id ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={contact.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                    alt={contact.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 block truncate">{contact.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{contact.designation} • {contact.subject || contact.department}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Body with WhatsApp Wallpaper Pattern */}
        <div 
          className="flex-1 p-4 overflow-y-auto space-y-2.5 text-xs bg-[#efeae2]/90"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
            backgroundSize: '18px 18px'
          }}
        >
          {/* Security Notice Pill */}
          <div className="flex justify-center my-1">
            <span className="text-[10px] bg-amber-100/90 text-amber-900 px-3 py-1 rounded-xl shadow-2xs border border-amber-200 text-center max-w-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700 flex-shrink-0" />
              Direct messages are strictly private & logged for academic records.
            </span>
          </div>

          {!activeChatPartner ? (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <p className="text-xs font-semibold">Select a faculty member from the Contacts list to start messaging.</p>
            </div>
          ) : conversation.length === 0 ? (
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
                    className={`max-w-[82%] p-2.5 px-3.5 rounded-2xl shadow-2xs relative transition ${
                      isMe 
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60' 
                        : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                    }`}
                  >
                    {msg.message && (
                      <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">{msg.message}</p>
                    )}

                    {msg.fileName && (
                      <div className="mt-1.5 p-2 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center gap-2 text-[11px]">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{msg.fileName}</span>
                      </div>
                    )}
                    
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

          {/* Animated typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-2.5 px-4 rounded-2xl rounded-tl-xs border border-slate-200 shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected file preview pill */}
        {selectedFile && (
          <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 truncate">
              <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold truncate">{selectedFile.name}</span>
              <span className="text-[10px] text-slate-500">({selectedFile.size})</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:text-rose-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        {activeChatPartner && (
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
        )}

        {/* Message Input Box */}
        {activeChatPartner && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <label className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer rounded-xl hover:bg-slate-100 transition">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                onChange={handleFileAttach}
                className="hidden"
              />
            </label>

            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Message ${activeChatPartner.name?.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() && !selectedFile}
              className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
