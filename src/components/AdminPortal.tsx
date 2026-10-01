import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  ArrowLeftRight, 
  RotateCcw, 
  Bot, 
  Headphones, 
  Paperclip, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { UserProfile, Transaction, ChatMessage, AdminLog, ChatAttachment } from '../lib/types.ts';
import { ADMIN_CREDENTIALS } from '../lib/constants.ts';
import { bankService } from '../lib/bank-service.ts';

interface AdminPortalProps {
  onLogout: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout, onSelectTransaction }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'ai_command' | 'support' | 'logs'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for actions on specific user
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundAccountType, setFundAccountType] = useState<'checking' | 'savings'>('checking');
  const [fundReason, setFundReason] = useState('');

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningLevel, setWarningLevel] = useState<'none' | 'info' | 'warning' | 'critical'>('warning');

  // AI Command Terminal State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiHistory, setAiHistory] = useState<{ role: 'admin' | 'ai'; text: string; actionExecuted?: string }[]>([
    {
      role: 'ai',
      text: "Veritas AI Central Command online. I have administrative authority over all bank operations, ledger transactions, and customer accounts under managementofficails001@gmail.com. Issue any directive or financial command."
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Live Support Desk State
  const [conversations, setConversations] = useState<{ conversationId: string; customerName: string; lastMessage: string; lastTime: string; unreadCount: number }[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatText, setAdminChatText] = useState('');
  const [adminAttachments, setAdminAttachments] = useState<ChatAttachment[]>([]);
  const [adminPreviewImage, setAdminPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminPhotoInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const refreshAll = () => {
    setUsers(bankService.getAllUsers());
    setTransactions(bankService.getAllTransactions());
    setAdminLogs(bankService.getAdminLogs());
    setConversations(bankService.getAllConversations());
    if (activeConversationId) {
      setActiveChatMessages(bankService.getChatMessages(activeConversationId));
    }
  };

  useEffect(() => {
    refreshAll();
    const unsub = bankService.subscribe(refreshAll);
    return () => unsub();
  }, [activeConversationId]);

  useEffect(() => {
    if (activeTab === 'support' && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].conversationId);
      bankService.markConversationRead(conversations[0].conversationId);
    }
  }, [activeTab, conversations, activeConversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  // Funding handler
  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid funding amount.');
      return;
    }

    await bankService.adminFundCustomer(
      selectedUser.uid,
      amount,
      fundAccountType,
      fundReason || 'Approved Bank Treasury Grant'
    );

    showToast(`Successfully credited $${amount.toLocaleString()} USD to ${selectedUser.fullName}'s ${fundAccountType} account.`);
    setShowFundModal(false);
    setFundAmount('');
    setFundReason('');
  };

  // Warning submit handler
  const handleWarningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    await bankService.adminSetWarning(selectedUser.uid, warningMessage, warningLevel);
    showToast(`Warning message updated on ${selectedUser.fullName}'s account.`);
    setShowWarningModal(false);
    setWarningMessage('');
  };

  // Lock toggle
  const handleToggleLock = async (user: UserProfile) => {
    const newLockState = !user.isLocked;
    await bankService.adminToggleLock(user.uid, newLockState);
    showToast(`Customer account for ${user.fullName} is now ${newLockState ? 'LOCKED' : 'UNLOCKED'}.`);
  };

  // Restrict transfers toggle
  const handleToggleRestriction = async (user: UserProfile) => {
    const newRestrictedState = !user.isTransferRestricted;
    await bankService.adminToggleTransferRestriction(user.uid, newRestrictedState);
    showToast(`Transfer privileges for ${user.fullName} are now ${newRestrictedState ? 'RESTRICTED' : 'RESTORED'}.`);
  };

  // Reverse transaction
  const handleReverseTransaction = async (tx: Transaction) => {
    if (!confirm(`Are you sure you want to reverse transaction ${tx.reference} for $${tx.amount.toLocaleString()} USD?`)) return;

    const res = await bankService.adminReverseTransaction(tx.id);
    if (res.success) {
      showToast(`Transaction ${tx.reference} successfully reversed. Funds restored to sender.`);
    } else {
      alert(res.error || 'Failed to reverse transaction.');
    }
  };

  // AI Command submission
  const handleAiCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userCommand = aiPrompt.trim();
    setAiPrompt('');
    setAiHistory(prev => [...prev, { role: 'admin', text: userCommand }]);
    setAiLoading(true);

    try {
      // Build real system context from current bank state
      const systemContext = `
Current Bank System Context:
Central Reserve: $10,000,000,000.00 USD
Active Customer Accounts: ${users.length}
Customers List: ${users.map(u => `${u.fullName} (uid: ${u.uid}, email: ${u.email}, checkingAcc: ${u.checkingAccountNumber}, checkingBal: $${u.checkingBalance}, locked: ${u.isLocked}, restricted: ${u.isTransferRestricted})`).join('; ')}
Recent Transactions: ${transactions.slice(0, 8).map(t => `${t.reference}: $${t.amount} USD from ${t.senderName} to ${t.recipientName} (${t.status})`).join('; ')}
`;

      const res = await fetch('/api/admin/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userCommand, systemContext })
      });

      const data = await res.json();
      let aiText = data.text || "Command parsed and acknowledged by Veritas AI.";

      // Autonomous action execution if AI indicates an action
      let executedActionNotice = '';
      const lower = userCommand.toLowerCase();

      // Check if command is to fund
      if (lower.includes('fund') && users.length > 0) {
        // Find targeted user
        const target = users.find(u => lower.includes(u.fullName.toLowerCase()) || lower.includes(u.email.toLowerCase()) || lower.includes(u.checkingAccountNumber));
        const amountMatch = userCommand.match(/\$?(\d+[\d,]*(\.\d+)?)/);
        if (target && amountMatch) {
          const amt = parseFloat(amountMatch[1].replace(/,/g, ''));
          if (amt > 0) {
            await bankService.adminFundCustomer(target.uid, amt, 'checking', `AI Authorized Command: ${userCommand}`);
            executedActionNotice = `[EXECUTED]: Funded $${amt.toLocaleString()} USD to ${target.fullName}'s account.`;
          }
        }
      } else if (lower.includes('lock') && users.length > 0) {
        const target = users.find(u => lower.includes(u.fullName.toLowerCase()) || lower.includes(u.email.toLowerCase()) || lower.includes(u.checkingAccountNumber));
        if (target) {
          await bankService.adminToggleLock(target.uid, true);
          executedActionNotice = `[EXECUTED]: Account for ${target.fullName} locked.`;
        }
      } else if (lower.includes('unlock') && users.length > 0) {
        const target = users.find(u => lower.includes(u.fullName.toLowerCase()) || lower.includes(u.email.toLowerCase()));
        if (target) {
          await bankService.adminToggleLock(target.uid, false);
          executedActionNotice = `[EXECUTED]: Account for ${target.fullName} unlocked.`;
        }
      } else if (lower.includes('reverse') && transactions.length > 0) {
        const txMatch = transactions.find(t => userCommand.includes(t.reference) || userCommand.includes(t.id));
        if (txMatch) {
          await bankService.adminReverseTransaction(txMatch.id);
          executedActionNotice = `[EXECUTED]: Transaction ${txMatch.reference} reversed.`;
        }
      }

      setAiHistory(prev => [...prev, { 
        role: 'ai', 
        text: aiText,
        actionExecuted: executedActionNotice 
      }]);
    } catch (err: any) {
      setAiHistory(prev => [...prev, { role: 'ai', text: "Autonomous bank controller execution completed: " + err.message }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Support chat: Admin file attachment handler
  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newAttachment: ChatAttachment = {
          id: 'att_adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          name: file.name,
          type: isImg ? 'image' : 'document',
          url,
          size: (file.size / 1024).toFixed(1) + ' KB'
        };
        setAdminAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdminSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId) return;
    if (!adminChatText.trim() && adminAttachments.length === 0) return;

    const activeUser = users.find(u => u.uid === activeConversationId);
    const textToSend = adminChatText.trim();
    const attsToSend = [...adminAttachments];
    setAdminChatText('');
    setAdminAttachments([]);

    await bankService.sendChatMessage({
      conversationId: activeConversationId,
      customerUid: activeConversationId,
      customerName: activeUser?.fullName || 'Valued Client',
      senderType: 'admin',
      senderName: 'Veritas Executive Management',
      text: textToSend,
      attachments: attsToSend
    });
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.checkingAccountNumber.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Institutional Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/10">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">VERITAS OPERATOR CONSOLE</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  Central Management
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operating Authority: <span className="font-mono text-emerald-400">{ADMIN_CREDENTIALS.email}</span> • Zero 2FA Bypass Verified
              </p>
            </div>
          </div>

          {/* Central Reserve Vault Display: $10 Billion USD */}
          <div className="flex items-center gap-6">
            <div className="bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-slate-800 shadow-inner text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Veritas Central Vault & Capital Reserves
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
                ${ADMIN_CREDENTIALS.vaultReserveUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-400">USD</span>
              </p>
            </div>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Sign off admin"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Console</span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Ledger & Reversals ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_command')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai_command'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Bank Commander</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">Gemini 3.8</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'support'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Live Support Desk</span>
            {conversations.some(c => c.unreadCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>System Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer by name, email, or account..."
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Total Registered Clients: <strong className="text-white">{users.length}</strong></span>
                <span>•</span>
                <span>Default Initial Balance: <strong className="text-emerald-400">$0.00</strong></span>
              </div>
            </div>

            {/* Customers Table / Grid */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Client Identity</th>
                      <th className="py-3.5 px-4 font-bold">Account Numbers</th>
                      <th className="py-3.5 px-4 font-bold">Checking Balance</th>
                      <th className="py-3.5 px-4 font-bold">Way2Save Savings</th>
                      <th className="py-3.5 px-4 font-bold">Account Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Management Interventions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No matching customer profiles found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.uid} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white text-sm">{user.fullName}</p>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                            <p className="text-[10px] text-slate-500 font-mono">PIN: {user.transactionPin || '1234'}</p>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <p>Chk: <span className="text-slate-200">...{user.checkingAccountNumber}</span></p>
                            <p>Sav: <span className="text-slate-200">...{user.savingsAccountNumber}</span></p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-sm text-emerald-400">
                              ${user.checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-sm text-white">
                              ${user.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 text-[10px]">
                              {user.isLocked && (
                                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold inline-block w-fit">
                                  LOCKED
                                </span>
                              )}
                              {user.isTransferRestricted && (
                                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold inline-block w-fit">
                                  TRANSFERS RESTRICTED
                                </span>
                              )}
                              {user.warningMessage && (
                                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold inline-block w-fit truncate max-w-[130px]" title={user.warningMessage}>
                                  WARN: {user.warningMessage}
                                </span>
                              )}
                              {!user.isLocked && !user.isTransferRestricted && !user.warningMessage && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800 font-bold inline-block w-fit">
                                  ACTIVE & COMPLIANT
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Fund Button */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowFundModal(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Fund</span>
                              </button>

                              {/* Warning Button */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setWarningMessage(user.warningMessage || '');
                                  setWarningLevel(user.warningLevel || 'warning');
                                  setShowWarningModal(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[11px] border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Warn</span>
                              </button>

                              {/* Transfer Restriction Toggle */}
                              <button
                                onClick={() => handleToggleRestriction(user)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center gap-1 ${
                                  user.isTransferRestricted
                                    ? 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                }`}
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>{user.isTransferRestricted ? 'Unrestrict' : 'Restrict'}</span>
                              </button>

                              {/* Lock Toggle */}
                              <button
                                onClick={() => handleToggleLock(user)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center gap-1 ${
                                  user.isLocked
                                    ? 'bg-rose-900 text-white border-rose-700 hover:bg-rose-800'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                }`}
                              >
                                {user.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                <span>{user.isLocked ? 'Unlock' : 'Lock'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TRANSACTIONS & REVERSAL CENTER TAB */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h3 className="text-base font-bold text-white">Central Banking Transaction Ledger</h3>
                <p className="text-slate-400">Audit, inspect, or immediately reverse any internal or international transaction.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                {transactions.length} Total Records
              </span>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Reference & Date</th>
                      <th className="py-3.5 px-4 font-bold">Type</th>
                      <th className="py-3.5 px-4 font-bold">Originator (Sender)</th>
                      <th className="py-3.5 px-4 font-bold">Beneficiary (Recipient)</th>
                      <th className="py-3.5 px-4 font-bold">Amount (USD)</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Operator Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {transactions.map(tx => {
                      const isReversed = tx.status === 'reversed';
                      return (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <p 
                              onClick={() => onSelectTransaction(tx)}
                              className="font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
                            >
                              {tx.reference}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 uppercase font-bold text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {tx.type}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{tx.senderName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{tx.senderAccount}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{tx.recipientName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {tx.recipientBank ? `${tx.recipientBank} (${tx.recipientCountry})` : tx.recipientAccount}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-sm">
                            <span className={isReversed ? 'text-slate-500 line-through' : 'text-white'}>
                              ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isReversed
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {isReversed ? (
                              <span className="text-[11px] text-slate-500 italic">Reversed</span>
                            ) : (
                              <button
                                onClick={() => handleReverseTransaction(tx)}
                                className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reverse Transaction</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI COMMAND TERMINAL TAB */}
        {activeTab === 'ai_command' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Veritas AI Central Command</h3>
                  <p className="text-slate-400">Autonomous banking operator assistant. Directly executes funding, locks, reversals, and compliance audits.</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 font-bold">
                Online • Powered by Gemini 3.8
              </span>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAiPrompt("Fund Ramyia $50,000 for approved commercial grant")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold cursor-pointer transition-all"
              >
                + Fund Ramyia $50,000
              </button>
              <button
                type="button"
                onClick={() => setAiPrompt("Audit international high-value transfers and liquidity health")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold cursor-pointer transition-all"
              >
                + Audit Liquidity Health
              </button>
              <button
                type="button"
                onClick={() => setAiPrompt("Lock user Marcus Vance account due to pending compliance verification")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold cursor-pointer transition-all"
              >
                + Lock Account Command
              </button>
            </div>

            {/* AI Terminal Output */}
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 h-[380px] overflow-y-auto space-y-4 font-mono text-xs">
              {aiHistory.map((item, index) => (
                <div key={index} className={`flex flex-col ${item.role === 'admin' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-1">
                    {item.role === 'admin' ? 'Operator Command' : 'Veritas AI'}
                  </span>
                  <div className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                    item.role === 'admin'
                      ? 'bg-slate-800 text-white rounded-br-xs'
                      : 'bg-emerald-950/40 text-emerald-200 border border-emerald-800/60 rounded-bl-xs'
                  }`}>
                    {item.text}
                    {item.actionExecuted && (
                      <div className="mt-2 pt-2 border-t border-emerald-800 text-amber-300 font-bold">
                        {item.actionExecuted}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Central Command processing directive...</span>
                </div>
              )}
            </div>

            {/* Command Prompt Input */}
            <form onSubmit={handleAiCommandSubmit} className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter command or question for AI operator (e.g. 'Fund user X $25,000' or 'Lock account Y')..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <span>Execute Command</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* LIVE SUPPORT DESK TAB */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
            
            {/* Conversation Threads Sidebar */}
            <div className="md:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white">Client Support Threads</span>
                <span className="text-[11px] text-slate-400">{conversations.length} Active</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800 text-xs">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    No active support messages received yet.
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.conversationId}
                      onClick={() => {
                        setActiveConversationId(conv.conversationId);
                        bankService.markConversationRead(conv.conversationId);
                      }}
                      className={`p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        activeConversationId === conv.conversationId ? 'bg-slate-800 border-l-4 border-emerald-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{conv.customerName}</span>
                        {conv.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{conv.lastMessage}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(conv.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Conversation View */}
            <div className="md:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              {activeConversationId ? (
                <>
                  <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">
                        {users.find(u => u.uid === activeConversationId)?.fullName || 'Client Inquiry'}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {users.find(u => u.uid === activeConversationId)?.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const u = users.find(usr => usr.uid === activeConversationId);
                          if (u) {
                            setSelectedUser(u);
                            setShowFundModal(true);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs"
                      >
                        Quick Fund Client
                      </button>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-950/40">
                    {activeChatMessages.map(msg => {
                      const isMe = msg.senderType === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-slate-500 mb-0.5">
                            {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div className={`p-3 rounded-2xl max-w-[80%] space-y-2 ${
                            isMe
                              ? 'bg-emerald-600 text-slate-950 font-medium rounded-br-xs'
                              : 'bg-slate-800 text-white rounded-bl-xs'
                          }`}>
                            {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                {msg.attachments.map(att => (
                                  <div key={att.id} className="rounded-xl overflow-hidden border border-slate-700/60 p-1.5 bg-slate-950/40">
                                    {att.type === 'image' ? (
                                      <div className="cursor-pointer group relative" onClick={() => setAdminPreviewImage(att.url)}>
                                        <img src={att.url} alt={att.name} className="max-h-56 w-full object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                          <span className="text-[10px] bg-slate-900/90 text-white px-2 py-1 rounded-md font-bold">Click to Expand Photo</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <a href={att.url} download={att.name} className="flex items-center justify-between gap-2 p-1 text-slate-200">
                                        <span className="truncate">{att.name}</span>
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Staged attachments */}
                  {adminAttachments.length > 0 && (
                    <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
                      {adminAttachments.map(att => (
                        <div key={att.id} className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-2 text-slate-200">
                          {att.type === 'image' && <img src={att.url} alt="" className="w-6 h-6 object-cover rounded" />}
                          <span className="max-w-[100px] truncate">{att.name}</span>
                          <button onClick={() => setAdminAttachments(prev => prev.filter(a => a.id !== att.id))} className="text-rose-400 hover:text-rose-300">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Bar */}
                  <form onSubmit={handleAdminSendReply} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="file"
                      ref={adminPhotoInputRef}
                      onChange={handleAdminFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAdminFileUpload}
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => adminPhotoInputRef.current?.click()}
                      title="Send Picture / Photo to Client"
                      className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline text-[11px] font-bold">Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Attach documents"
                      className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={adminChatText}
                      onChange={(e) => setAdminChatText(e.target.value)}
                      placeholder="Type response to client as Veritas Executive Management..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />

                    <button
                      type="submit"
                      disabled={!adminChatText.trim() && adminAttachments.length === 0}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Admin Picture Lightbox */}
                  {adminPreviewImage && (
                    <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="relative max-w-2xl max-h-[85vh] w-full flex flex-col items-center">
                        <button
                          onClick={() => setAdminPreviewImage(null)}
                          className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 cursor-pointer"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <img
                          src={adminPreviewImage}
                          alt="Enlarged client photo"
                          className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  Select a client support thread to inspect and reply.
                </div>
              )}
            </div>

          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Immutable Operator Audit Trail</h3>
            <p className="text-xs text-slate-400">Veritas automated cryptographic record of all administrative actions.</p>

            <div className="divide-y divide-slate-800 font-mono text-xs">
              {adminLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-emerald-400 font-bold uppercase">[{log.action}]</span>
                    <span className="text-slate-300 ml-2">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: FUND CUSTOMER */}
      {showFundModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Fund Customer Account</span>
              <button onClick={() => setShowFundModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-slate-400">Beneficiary Client:</p>
              <p className="font-bold text-white text-sm">{selectedUser.fullName} ({selectedUser.email})</p>
            </div>

            <form onSubmit={handleFundSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Target Account</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFundAccountType('checking')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                      fundAccountType === 'checking'
                        ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    Checking (...{selectedUser.checkingAccountNumber})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFundAccountType('savings')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                      fundAccountType === 'savings'
                        ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    Savings (...{selectedUser.savingsAccountNumber})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Funding Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="10000.00"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-base focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Reason / Ledger Memo</label>
                <input
                  type="text"
                  value={fundReason}
                  onChange={(e) => setFundReason(e.target.value)}
                  placeholder="e.g. Approved Wire Deposit, Verified Treasury Credit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all cursor-pointer"
              >
                Execute Account Credit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WRITE WARNING MESSAGE */}
      {showWarningModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Compose Warning Notice for Client</span>
              <button onClick={() => setShowWarningModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400">
              This message will display prominently on <strong className="text-white">{selectedUser.fullName}'s</strong> banking dashboard.
            </p>

            <form onSubmit={handleWarningSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Severity Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'info', 'warning', 'critical'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWarningLevel(lvl)}
                      className={`py-1.5 px-2 rounded-lg font-bold uppercase text-[10px] cursor-pointer ${
                        warningLevel === lvl ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Warning Message</label>
                <textarea
                  rows={3}
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="e.g. Compliance Notice: Please submit proof of source of wealth within 48 hours to prevent account pause."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                {selectedUser.warningMessage && (
                  <button
                    type="button"
                    onClick={() => {
                      bankService.adminSetWarning(selectedUser.uid, '', 'none');
                      showToast('Warning cleared.');
                      setShowWarningModal(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold cursor-pointer"
                  >
                    Clear Warning
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Publish Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
