import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  CheckCheck, 
  ShieldCheck, 
  Headphones, 
  Download, 
  Maximize2,
  Paperclip
} from 'lucide-react';
import { ChatMessage, ChatAttachment, UserProfile } from '../lib/types.ts';
import { bankService } from '../lib/bank-service.ts';

interface LiveSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = currentUser.uid;

  useEffect(() => {
    if (!isOpen) return;

    const loadMessages = () => {
      const msgs = bankService.getChatMessages(conversationId);
      setMessages(msgs);
    };

    loadMessages();
    const unsub = bankService.subscribe(loadMessages);
    return () => unsub();
  }, [isOpen, conversationId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Process selected image files
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newAttachment: ChatAttachment = {
          id: 'pic_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name || 'Photo.jpg',
          type: 'image',
          url,
          size: (file.size / 1024).toFixed(1) + ' KB'
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Process selected document files
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newAttachment: ChatAttachment = {
          id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          type: 'document',
          url,
          size: (file.size / 1024).toFixed(1) + ' KB'
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (docInputRef.current) docInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    setSending(true);
    const textToSend = inputText.trim();
    const attsToSend = [...attachments];
    setInputText('');
    setAttachments([]);

    try {
      await bankService.sendChatMessage({
        conversationId,
        customerUid: currentUser.uid,
        customerName: currentUser.fullName,
        customerEmail: currentUser.email,
        senderType: 'customer',
        senderName: currentUser.fullName,
        text: textToSend,
        attachments: attsToSend
      });
    } catch (e) {
      console.error('Failed to send chat message', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-md h-[92vh] sm:h-[650px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-5 shrink-0 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute bottom-0 right-0"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight">Veritas Concierge Banker</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">Live</span>
              </div>
              <p className="text-[11px] text-slate-400">Encrypted 24/7 Priority Support Desk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security bar */}
        <div className="bg-slate-100 px-4 py-2 text-[11px] text-slate-600 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Send photos, receipts & documents directly in this chat.</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">AES-256</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
          {messages.length === 0 && (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">Connecting to your dedicated banking officer...</p>
              <p className="text-[11px]">Send a message or attach photos of checks, receipts, or documents.</p>
            </div>
          )}

          {messages.map(msg => {
            const isMe = msg.senderType === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>•</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs space-y-2 ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* High fidelity image / attachment gallery */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.attachments.map(att => (
                        <div key={att.id} className="rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950/20">
                          {att.type === 'image' ? (
                            <div className="relative group cursor-pointer" onClick={() => setPreviewImage(att.url)}>
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-h-56 w-full object-cover rounded-lg group-hover:opacity-95 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold flex items-center gap-1">
                                  <Maximize2 className="w-3 h-3" />
                                  <span>View Photo</span>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 px-2 py-1 truncate">{att.name}</p>
                            </div>
                          ) : (
                            <a
                              href={att.url}
                              download={att.name}
                              className="flex items-center justify-between gap-2 p-2 hover:bg-slate-800/40 rounded-lg text-slate-200 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="truncate text-[11px] font-medium">{att.name}</span>
                              </div>
                              <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isMe && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1">
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span>Delivered</span>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Staged attachments preview before sending */}
        {attachments.length > 0 && (
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex gap-2.5 overflow-x-auto">
            {attachments.map(att => (
              <div key={att.id} className="relative bg-white rounded-xl p-1.5 border border-slate-300 shrink-0 shadow-2xs">
                {att.type === 'image' ? (
                  <div className="relative">
                    <img src={att.url} alt={att.name} className="w-14 h-14 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-rose-600 cursor-pointer shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="max-w-[80px] truncate text-[11px] font-medium">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Input Bar with Dedicated Picture and Document Buttons */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
          {/* Hidden inputs for Image and Document */}
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageSelect}
            multiple
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={docInputRef}
            onChange={handleDocSelect}
            multiple
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />

          {/* Picture Send Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            title="Send Picture / Photo"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-bold">Photo</span>
          </button>

          {/* Document Attachment Button */}
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            title="Attach Document"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message or question..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!inputText.trim() && attachments.length === 0)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

      </div>

      {/* Picture Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-2xl max-h-[85vh] w-full flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Enlarged preview"
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};
