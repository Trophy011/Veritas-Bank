export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  address: string;
  role: UserRole;
  checkingAccountNumber: string; // e.g. "2246"
  savingsAccountNumber: string;   // e.g. "9019"
  cardAccountNumber: string;      // e.g. "0739"
  checkingBalance: number;
  savingsBalance: number;
  cardBalance: number;
  cardLimit: number;
  transactionPin: string;         // 4-digit PIN e.g. "4466"
  isLocked: boolean;
  isTransferRestricted: boolean;
  warningMessage?: string;
  warningLevel?: 'none' | 'info' | 'warning' | 'critical';
  creditScore: number;            // e.g. 780
  cashRewards: number;            // e.g. 27.70
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'internal' | 'international' | 'deposit' | 'admin_fund' | 'reversal';
export type TransactionStatus = 'completed' | 'reversed' | 'pending' | 'flagged';

export interface Transaction {
  id: string;
  senderUid: string;
  senderName: string;
  senderAccount: string;
  recipientUid?: string;
  recipientName: string;
  recipientAccount: string;
  recipientBank?: string;
  recipientCountry?: string;
  recipientSwift?: string;
  recipientIban?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  convertedAmount?: number;
  targetCurrency?: string;
  exchangeRate?: number;
  status: TransactionStatus;
  memo: string;
  reference: string;
  pinVerified: boolean;
  createdAt: string;
  reversedAt?: string | null;
  reversedBy?: string | null;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  customerUid: string;
  customerName: string;
  customerEmail?: string;
  senderType: 'customer' | 'admin' | 'system';
  senderName: string;
  text: string;
  attachments?: ChatAttachment[];
  read: boolean;
  createdAt: string;
}

export interface CountryBank {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X foreign currency
  banks: {
    name: string;
    swiftCode: string;
    code: string;
  }[];
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  targetUid?: string;
  targetUser?: string;
  details: string;
  createdAt: string;
}
