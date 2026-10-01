import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { UserProfile, Transaction, ChatMessage, AdminLog } from './types.ts';
import { ADMIN_CREDENTIALS } from './constants.ts';

const USERS_STORAGE_KEY = 'veritas_bank_users_v2';
const TRANSACTIONS_STORAGE_KEY = 'veritas_bank_transactions_v2';
const CHAT_STORAGE_KEY = 'veritas_bank_chat_v2';
const LOGS_STORAGE_KEY = 'veritas_bank_logs_v2';
const CURRENT_USER_KEY = 'veritas_current_user_v2';

// Seed initial default demo users for rich experience
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    uid: 'user_ramyia_2246',
    email: 'ramyia.davis@veritas.bank',
    fullName: 'Ramyia Davis',
    firstName: 'Ramyia',
    lastName: 'Davis',
    phone: '+1 (555) 382-9018',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    role: 'customer',
    checkingAccountNumber: '2246',
    savingsAccountNumber: '9019',
    cardAccountNumber: '0739',
    checkingBalance: 22081.16,
    savingsBalance: 150103.25,
    cardBalance: 92.13,
    cardLimit: 15000.00,
    transactionPin: '4466',
    isLocked: false,
    isTransferRestricted: false,
    warningMessage: '',
    warningLevel: 'none',
    creditScore: 780,
    cashRewards: 27.70,
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user_marcus_5512',
    email: 'marcus.vance@techcorp.io',
    fullName: 'Marcus Vance',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '+1 (555) 782-4411',
    address: '120 Broadway Ave, New York, NY 10005',
    role: 'customer',
    checkingAccountNumber: '5512',
    savingsAccountNumber: '3341',
    cardAccountNumber: '8820',
    checkingBalance: 8450.00,
    savingsBalance: 42000.00,
    cardBalance: 450.20,
    cardLimit: 10000.00,
    transactionPin: '1234',
    isLocked: false,
    isTransferRestricted: false,
    warningMessage: '',
    warningLevel: 'none',
    creditScore: 745,
    cashRewards: 14.50,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'admin_management_master',
    email: ADMIN_CREDENTIALS.email,
    fullName: ADMIN_CREDENTIALS.fullName,
    firstName: 'Executive',
    lastName: 'Management',
    phone: '+1 (800) 837-4827',
    address: 'One Veritas Financial Tower, Wall Street, NY 10005',
    role: 'admin',
    checkingAccountNumber: '0001',
    savingsAccountNumber: '0002',
    cardAccountNumber: '0003',
    checkingBalance: ADMIN_CREDENTIALS.vaultReserveUSD, // 10 Billion USD
    savingsBalance: 0,
    cardBalance: 0,
    cardLimit: 1000000000,
    transactionPin: '4466',
    isLocked: false,
    isTransferRestricted: false,
    creditScore: 850,
    cashRewards: 0,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_seed_01',
    senderUid: 'admin_management_master',
    senderName: 'Veritas Central Treasury',
    senderAccount: '...0001',
    recipientUid: 'user_ramyia_2246',
    recipientName: 'Ramyia Davis',
    recipientAccount: '...2246',
    type: 'admin_fund',
    amount: 22000.00,
    currency: 'USD',
    status: 'completed',
    memo: 'Payroll Direct Deposit - Sovereign Tech LLC',
    reference: 'REF-VD-883921',
    pinVerified: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx_seed_02',
    senderUid: 'user_ramyia_2246',
    senderName: 'Ramyia Davis',
    senderAccount: '...2246',
    recipientUid: 'user_marcus_5512',
    recipientName: 'Marcus Vance',
    recipientAccount: '...5512',
    type: 'internal',
    amount: 150.00,
    currency: 'USD',
    status: 'completed',
    memo: 'Dinner & Tech Conference Split',
    reference: 'REF-TX-990234',
    pinVerified: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

class BankService {
  private users: UserProfile[] = [];
  private transactions: Transaction[] = [];
  private chatMessages: ChatMessage[] = [];
  private adminLogs: AdminLog[] = [];
  private currentUser: UserProfile | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.initFromStorage();
    this.syncFromFirestore();
  }

  private initFromStorage() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Ensure admin user has $10 Billion
        const adminIndex = this.users.findIndex(u => u.email === ADMIN_CREDENTIALS.email);
        if (adminIndex !== -1) {
          this.users[adminIndex].checkingBalance = ADMIN_CREDENTIALS.vaultReserveUSD;
        } else {
          this.users.push(INITIAL_DEMO_USERS[2]);
        }
      } else {
        this.users = [...INITIAL_DEMO_USERS];
        this.saveUsers();
      }

      const storedTx = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (storedTx) {
        this.transactions = JSON.parse(storedTx);
      } else {
        this.transactions = [...INITIAL_TRANSACTIONS];
        this.saveTransactions();
      }

      const storedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChat) {
        this.chatMessages = JSON.parse(storedChat);
      } else {
        this.chatMessages = [
          {
            id: 'msg_welcome',
            conversationId: 'user_ramyia_2246',
            customerUid: 'user_ramyia_2246',
            customerName: 'Ramyia Davis',
            senderType: 'admin',
            senderName: 'Veritas Priority Executive',
            text: 'Good day, Ramyia. Welcome to Veritas 24/7 Concierge Support. How may we assist your financial accounts today?',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        this.saveChat();
      }

      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        this.adminLogs = JSON.parse(storedLogs);
      }

      const storedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedCurrentUser) {
        const parsed = JSON.parse(storedCurrentUser);
        const liveUser = this.users.find(u => u.uid === parsed.uid);
        this.currentUser = liveUser || parsed;
      }
    } catch (e) {
      console.warn('Local storage init error, using defaults', e);
      this.users = [...INITIAL_DEMO_USERS];
      this.transactions = [...INITIAL_TRANSACTIONS];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.warn('Storage saveUsers failed', e);
    }
  }

  private saveTransactions() {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactions));
    } catch (e) {
      console.warn('Storage saveTransactions failed', e);
    }
  }

  private saveChat() {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(this.chatMessages));
    } catch (e) {
      console.warn('Storage saveChat failed', e);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.adminLogs));
    } catch (e) {
      console.warn('Storage saveLogs failed', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    if (this.currentUser) {
      const refreshed = this.users.find(u => u.uid === this.currentUser?.uid);
      if (refreshed) {
        this.currentUser = refreshed;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(refreshed));
      }
    }
    this.listeners.forEach(cb => cb());
  }

  // Firestore background sync
  private async syncFromFirestore() {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        usersSnap.forEach(docSnap => {
          const data = docSnap.data() as UserProfile;
          const idx = this.users.findIndex(u => u.uid === data.uid);
          if (idx >= 0) {
            this.users[idx] = { ...this.users[idx], ...data };
          } else {
            this.users.push(data);
          }
        });
        this.saveUsers();
        this.notify();
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'users');
    }

    try {
      const txSnap = await getDocs(collection(db, 'transactions'));
      if (!txSnap.empty) {
        const txList: Transaction[] = [];
        txSnap.forEach(docSnap => {
          txList.push(docSnap.data() as Transaction);
        });
        if (txList.length > 0) {
          this.transactions = txList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.saveTransactions();
          this.notify();
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'transactions');
    }
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getAllUsers(): UserProfile[] {
    return this.users.filter(u => u.role !== 'admin');
  }

  public getAllTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getUserTransactions(uid: string): Transaction[] {
    return this.transactions
      .filter(tx => tx.senderUid === uid || tx.recipientUid === uid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAdminLogs(): AdminLog[] {
    return [...this.adminLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getChatMessages(conversationId?: string): ChatMessage[] {
    if (!conversationId) return this.chatMessages;
    return this.chatMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public getAllConversations(): { conversationId: string; customerName: string; lastMessage: string; lastTime: string; unreadCount: number }[] {
    const map = new Map<string, { conversationId: string; customerName: string; lastMessage: string; lastTime: string; unreadCount: number }>();
    this.chatMessages.forEach(msg => {
      const existing = map.get(msg.conversationId);
      const isUnread = !msg.read && msg.senderType === 'customer';
      if (!existing || new Date(msg.createdAt) > new Date(existing.lastTime)) {
        map.set(msg.conversationId, {
          conversationId: msg.conversationId,
          customerName: msg.customerName,
          lastMessage: msg.text || (msg.attachments?.length ? 'Sent an attachment' : ''),
          lastTime: msg.createdAt,
          unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0)
        });
      } else if (isUnread) {
        existing.unreadCount += 1;
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
  }

  // Authentication: Customer or Admin
  public async login(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Check Admin login: credentials managementofficails001@gmail.com and password smart446688
    if (cleanEmail === ADMIN_CREDENTIALS.email) {
      if (password && password !== ADMIN_CREDENTIALS.password) {
        return { success: false, error: 'Invalid operator security password.' };
      }
      let admin = this.users.find(u => u.email === ADMIN_CREDENTIALS.email);
      if (!admin) {
        admin = INITIAL_DEMO_USERS[2];
        this.users.push(admin);
      }
      admin.checkingBalance = ADMIN_CREDENTIALS.vaultReserveUSD; // $10,000,000,000
      this.currentUser = admin;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(admin));
      this.saveUsers();
      this.notify();
      return { success: true, user: admin };
    }

    // Customer login
    const found = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address. Please register.' };
    }

    this.currentUser = found;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    this.notify();
    return { success: true, user: found };
  }

  // Registration: New user MUST have 0 balance!
  public async register(params: {
    email: string;
    fullName: string;
    phone: string;
    address: string;
    transactionPin?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = params.email.trim().toLowerCase();
    if (this.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account already exists with this email. Please sign in.' };
    }

    const randomSuffix = () => Math.floor(1000 + Math.random() * 9000).toString();
    const checkingLast4 = randomSuffix();
    const savingsLast4 = randomSuffix();
    const cardLast4 = randomSuffix();

    const nameParts = params.fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Requirement: New users has 0 balance!
    const newUser: UserProfile = {
      uid: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      fullName: params.fullName.trim(),
      firstName,
      lastName,
      phone: params.phone.trim(),
      address: params.address.trim() || 'Veritas Client Residence',
      role: 'customer',
      checkingAccountNumber: checkingLast4,
      savingsAccountNumber: savingsLast4,
      cardAccountNumber: cardLast4,
      checkingBalance: 0.00, // Explicitly $0.00 balance
      savingsBalance: 0.00,  // Explicitly $0.00 balance
      cardBalance: 0.00,     // Explicitly $0.00 balance
      cardLimit: 5000.00,
      transactionPin: params.transactionPin?.trim() || '1234',
      isLocked: false,
      isTransferRestricted: false,
      warningMessage: '',
      warningLevel: 'none',
      creditScore: 720,
      cashRewards: 0.00,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveUsers();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    // Save to Firestore
    try {
      await setDoc(doc(db, 'users', newUser.uid), newUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${newUser.uid}`);
    }

    this.notify();
    return { success: true, user: newUser };
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    this.notify();
  }

  // Profile Update
  public async updateProfile(uid: string, data: Partial<UserProfile>): Promise<boolean> {
    const idx = this.users.findIndex(u => u.uid === uid);
    if (idx === -1) return false;

    this.users[idx] = {
      ...this.users[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (this.currentUser?.uid === uid) {
      this.currentUser = this.users[idx];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.currentUser));
    }

    this.saveUsers();

    try {
      await updateDoc(doc(db, 'users', uid), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}`);
    }

    this.notify();
    return true;
  }

  // Mobile Check / Wire Deposit Simulation
  public async depositFunds(uid: string, accountType: 'checking' | 'savings', amount: number, memo = 'Mobile Check Deposit'): Promise<{ success: boolean; error?: string }> {
    const user = this.users.find(u => u.uid === uid);
    if (!user) return { success: false, error: 'User not found' };
    if (user.isLocked) return { success: false, error: 'Account is locked by management. Deposit cannot be cleared.' };

    if (accountType === 'checking') {
      user.checkingBalance += amount;
    } else {
      user.savingsBalance += amount;
    }

    const tx: Transaction = {
      id: 'tx_dep_' + Date.now(),
      senderUid: 'bank_clearance_house',
      senderName: 'Veritas Digital Clearance',
      senderAccount: '...0000',
      recipientUid: user.uid,
      recipientName: user.fullName,
      recipientAccount: '...' + (accountType === 'checking' ? user.checkingAccountNumber : user.savingsAccountNumber),
      type: 'deposit',
      amount,
      currency: 'USD',
      status: 'completed',
      memo,
      reference: 'DEP-' + Math.floor(100000 + Math.random() * 900000),
      pinVerified: true,
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(tx);
    this.saveUsers();
    this.saveTransactions();

    try {
      await updateDoc(doc(db, 'users', uid), {
        checkingBalance: user.checkingBalance,
        savingsBalance: user.savingsBalance
      });
      await setDoc(doc(db, 'transactions', tx.id), tx);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `transactions/${tx.id}`);
    }

    this.notify();
    return { success: true };
  }

  // Internal Transfer (Bank to Bank user)
  public async executeInternalTransfer(params: {
    senderUid: string;
    sourceAccount: 'checking' | 'savings';
    recipientQuery: string; // account number or email
    amount: number;
    memo: string;
    pin: string;
  }): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    const sender = this.users.find(u => u.uid === params.senderUid);
    if (!sender) return { success: false, error: 'Sender not found' };

    if (sender.isLocked) {
      return { success: false, error: 'Security Notice: Your Veritas account is currently locked. Transfers are unavailable. Please contact management.' };
    }
    if (sender.isTransferRestricted) {
      return { success: false, error: 'Security Restriction: Transfer capability has been restricted on this account by bank management. Please contact customer support.' };
    }
    if (sender.transactionPin && sender.transactionPin !== params.pin) {
      return { success: false, error: 'Incorrect 4-digit transaction PIN.' };
    }

    const available = params.sourceAccount === 'checking' ? sender.checkingBalance : sender.savingsBalance;
    if (available < params.amount) {
      return { success: false, error: `Insufficient funds. Available: $${available.toFixed(2)} USD` };
    }

    // Find recipient by checking, savings, or email
    const queryClean = params.recipientQuery.trim().toLowerCase();
    const recipient = this.users.find(u =>
      u.uid !== sender.uid && (
        u.email.toLowerCase() === queryClean ||
        u.checkingAccountNumber === queryClean ||
        u.savingsAccountNumber === queryClean ||
        u.fullName.toLowerCase() === queryClean
      )
    );

    if (!recipient) {
      return { success: false, error: 'Recipient account not found within Veritas Online Banking. Please verify the account number or email.' };
    }

    // Execute balances
    if (params.sourceAccount === 'checking') {
      sender.checkingBalance -= params.amount;
    } else {
      sender.savingsBalance -= params.amount;
    }
    recipient.checkingBalance += params.amount;

    const tx: Transaction = {
      id: 'tx_int_' + Date.now(),
      senderUid: sender.uid,
      senderName: sender.fullName,
      senderAccount: '...' + (params.sourceAccount === 'checking' ? sender.checkingAccountNumber : sender.savingsAccountNumber),
      recipientUid: recipient.uid,
      recipientName: recipient.fullName,
      recipientAccount: '...' + recipient.checkingAccountNumber,
      type: 'internal',
      amount: params.amount,
      currency: 'USD',
      status: 'completed',
      memo: params.memo || 'Veritas Internal Transfer',
      reference: 'VT-INT-' + Math.floor(1000000 + Math.random() * 9000000),
      pinVerified: true,
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(tx);
    this.saveUsers();
    this.saveTransactions();

    try {
      await updateDoc(doc(db, 'users', sender.uid), {
        checkingBalance: sender.checkingBalance,
        savingsBalance: sender.savingsBalance
      });
      await updateDoc(doc(db, 'users', recipient.uid), {
        checkingBalance: recipient.checkingBalance
      });
      await setDoc(doc(db, 'transactions', tx.id), tx);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `transactions/${tx.id}`);
    }

    this.notify();
    return { success: true, transaction: tx };
  }

  // International Transfer
  public async executeInternationalTransfer(params: {
    senderUid: string;
    sourceAccount: 'checking' | 'savings';
    recipientName: string;
    recipientCountry: string;
    recipientBank: string;
    recipientIban: string;
    recipientSwift: string;
    amountUSD: number;
    convertedAmount: number;
    targetCurrency: string;
    exchangeRate: number;
    memo: string;
    pin: string;
  }): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    const sender = this.users.find(u => u.uid === params.senderUid);
    if (!sender) return { success: false, error: 'Sender not found' };

    if (sender.isLocked) {
      return { success: false, error: 'Account is locked by management. International transfers disabled.' };
    }
    if (sender.isTransferRestricted) {
      return { success: false, error: 'International transfers are currently restricted on your profile.' };
    }
    if (sender.transactionPin && sender.transactionPin !== params.pin) {
      return { success: false, error: 'Incorrect 4-digit transaction PIN.' };
    }

    const available = params.sourceAccount === 'checking' ? sender.checkingBalance : sender.savingsBalance;
    if (available < params.amountUSD) {
      return { success: false, error: `Insufficient balance. Available: $${available.toFixed(2)} USD` };
    }

    if (params.sourceAccount === 'checking') {
      sender.checkingBalance -= params.amountUSD;
    } else {
      sender.savingsBalance -= params.amountUSD;
    }

    const tx: Transaction = {
      id: 'tx_swift_' + Date.now(),
      senderUid: sender.uid,
      senderName: sender.fullName,
      senderAccount: '...' + (params.sourceAccount === 'checking' ? sender.checkingAccountNumber : sender.savingsAccountNumber),
      recipientName: params.recipientName,
      recipientAccount: params.recipientIban,
      recipientBank: params.recipientBank,
      recipientCountry: params.recipientCountry,
      recipientSwift: params.recipientSwift,
      recipientIban: params.recipientIban,
      type: 'international',
      amount: params.amountUSD,
      currency: 'USD',
      convertedAmount: params.convertedAmount,
      targetCurrency: params.targetCurrency,
      exchangeRate: params.exchangeRate,
      status: 'completed',
      memo: params.memo || 'International SWIFT Wire Transfer',
      reference: 'SWIFT-VT-' + Math.floor(10000000 + Math.random() * 90000000),
      pinVerified: true,
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(tx);
    this.saveUsers();
    this.saveTransactions();

    try {
      await updateDoc(doc(db, 'users', sender.uid), {
        checkingBalance: sender.checkingBalance,
        savingsBalance: sender.savingsBalance
      });
      await setDoc(doc(db, 'transactions', tx.id), tx);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `transactions/${tx.id}`);
    }

    this.notify();
    return { success: true, transaction: tx };
  }

  // ADMIN: Fund Customer Account
  public async adminFundCustomer(targetUid: string, amount: number, accountType: 'checking' | 'savings', reason: string): Promise<boolean> {
    const target = this.users.find(u => u.uid === targetUid);
    if (!target) return false;

    if (accountType === 'checking') {
      target.checkingBalance += amount;
    } else {
      target.savingsBalance += amount;
    }

    const tx: Transaction = {
      id: 'tx_adm_' + Date.now(),
      senderUid: 'admin_management_master',
      senderName: 'Veritas Central Treasury',
      senderAccount: '...0001',
      recipientUid: target.uid,
      recipientName: target.fullName,
      recipientAccount: '...' + (accountType === 'checking' ? target.checkingAccountNumber : target.savingsAccountNumber),
      type: 'admin_fund',
      amount,
      currency: 'USD',
      status: 'completed',
      memo: reason || 'Approved Bank Management Grant / Deposit',
      reference: 'ADM-GRT-' + Math.floor(100000 + Math.random() * 900000),
      pinVerified: true,
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(tx);

    this.logAdminAction('fund_customer', target.uid, target.fullName, `Funded $${amount.toLocaleString()} USD to ${accountType} account. Reason: ${reason}`);

    this.saveUsers();
    this.saveTransactions();

    try {
      await updateDoc(doc(db, 'users', target.uid), {
        checkingBalance: target.checkingBalance,
        savingsBalance: target.savingsBalance
      });
      await setDoc(doc(db, 'transactions', tx.id), tx);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${target.uid}`);
    }

    this.notify();
    return true;
  }

  // ADMIN: Reverse Any Transaction
  public async adminReverseTransaction(transactionId: string): Promise<{ success: boolean; error?: string }> {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (!tx) return { success: false, error: 'Transaction not found.' };
    if (tx.status === 'reversed') return { success: false, error: 'Transaction has already been reversed.' };

    const sender = this.users.find(u => u.uid === tx.senderUid);
    const recipient = tx.recipientUid ? this.users.find(u => u.uid === tx.recipientUid) : null;

    // Refund sender
    if (sender) {
      sender.checkingBalance += tx.amount;
    }

    // Deduct recipient if internal
    if (recipient && tx.type === 'internal') {
      recipient.checkingBalance = Math.max(0, recipient.checkingBalance - tx.amount);
    }

    tx.status = 'reversed';
    tx.reversedAt = new Date().toISOString();
    tx.reversedBy = ADMIN_CREDENTIALS.email;

    this.logAdminAction(
      'reverse_transaction',
      tx.senderUid,
      tx.senderName,
      `Reversed transaction ${tx.reference} ($${tx.amount.toLocaleString()} USD). Sender restored.`
    );

    this.saveUsers();
    this.saveTransactions();

    try {
      await updateDoc(doc(db, 'transactions', tx.id), {
        status: 'reversed',
        reversedAt: tx.reversedAt,
        reversedBy: tx.reversedBy
      });
      if (sender) {
        await updateDoc(doc(db, 'users', sender.uid), { checkingBalance: sender.checkingBalance });
      }
      if (recipient) {
        await updateDoc(doc(db, 'users', recipient.uid), { checkingBalance: recipient.checkingBalance });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `transactions/${tx.id}`);
    }

    this.notify();
    return { success: true };
  }

  // ADMIN: Lock / Unlock Customer Account
  public async adminToggleLock(targetUid: string, lock: boolean): Promise<boolean> {
    const target = this.users.find(u => u.uid === targetUid);
    if (!target) return false;

    target.isLocked = lock;
    this.logAdminAction(
      lock ? 'lock_account' : 'unlock_account',
      target.uid,
      target.fullName,
      `${lock ? 'Locked' : 'Unlocked'} customer account privileges.`
    );

    this.saveUsers();

    try {
      await updateDoc(doc(db, 'users', target.uid), { isLocked: lock });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${target.uid}`);
    }

    this.notify();
    return true;
  }

  // ADMIN: Restrict / Unrestrict Transfers
  public async adminToggleTransferRestriction(targetUid: string, restrict: boolean): Promise<boolean> {
    const target = this.users.find(u => u.uid === targetUid);
    if (!target) return false;

    target.isTransferRestricted = restrict;
    this.logAdminAction(
      restrict ? 'restrict_transfers' : 'unrestrict_transfers',
      target.uid,
      target.fullName,
      `${restrict ? 'Restricted' : 'Restored'} outgoing transfer capabilities.`
    );

    this.saveUsers();

    try {
      await updateDoc(doc(db, 'users', target.uid), { isTransferRestricted: restrict });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${target.uid}`);
    }

    this.notify();
    return true;
  }

  // ADMIN: Write Warning Message to Account
  public async adminSetWarning(targetUid: string, message: string, level: 'none' | 'info' | 'warning' | 'critical' = 'warning'): Promise<boolean> {
    const target = this.users.find(u => u.uid === targetUid);
    if (!target) return false;

    target.warningMessage = message;
    target.warningLevel = level;

    this.logAdminAction(
      'set_warning',
      target.uid,
      target.fullName,
      `Issued warning [${level.toUpperCase()}]: "${message}"`
    );

    this.saveUsers();

    try {
      await updateDoc(doc(db, 'users', target.uid), {
        warningMessage: message,
        warningLevel: level
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${target.uid}`);
    }

    this.notify();
    return true;
  }

  // Support Chat: Send Message
  public async sendChatMessage(params: {
    conversationId: string;
    customerUid: string;
    customerName: string;
    customerEmail?: string;
    senderType: 'customer' | 'admin';
    senderName: string;
    text: string;
    attachments?: { id: string; name: string; type: 'image' | 'document'; url: string; size?: string }[];
  }): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      conversationId: params.conversationId,
      customerUid: params.customerUid,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      senderType: params.senderType,
      senderName: params.senderName,
      text: params.text,
      attachments: params.attachments || [],
      read: params.senderType === 'admin',
      createdAt: new Date().toISOString()
    };

    this.chatMessages.push(newMsg);
    this.saveChat();

    try {
      await setDoc(doc(db, 'chat_messages', newMsg.id), newMsg);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `chat_messages/${newMsg.id}`);
    }

    this.notify();
    return newMsg;
  }

  public markConversationRead(conversationId: string) {
    let changed = false;
    this.chatMessages.forEach(m => {
      if (m.conversationId === conversationId && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveChat();
      this.notify();
    }
  }

  private logAdminAction(action: string, targetUid?: string, targetUser?: string, details = '') {
    const log: AdminLog = {
      id: 'log_' + Date.now(),
      adminEmail: ADMIN_CREDENTIALS.email,
      action,
      targetUid,
      targetUser,
      details,
      createdAt: new Date().toISOString()
    };
    this.adminLogs.unshift(log);
    this.saveLogs();
  }
}

export const bankService = new BankService();
