import { useState, useEffect } from 'react';

export interface SavedBankAccount {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface SavedCryptoWallet {
  id: string;
  exchangeCode: string;
  exchangeName: string;
  network: string;
  walletAddress: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
}

const BANK_STORAGE_KEY = 'saved_bank_accounts';
const CRYPTO_STORAGE_KEY = 'saved_crypto_wallets';

export const useSavedBankAccounts = () => {
  const [savedAccounts, setSavedAccounts] = useState<SavedBankAccount[]>([]);
  const [savedWallets, setSavedWallets] = useState<SavedCryptoWallet[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem(BANK_STORAGE_KEY);
    const storedWallets = localStorage.getItem(CRYPTO_STORAGE_KEY);
    
    if (storedAccounts) {
      setSavedAccounts(JSON.parse(storedAccounts));
    }
    if (storedWallets) {
      setSavedWallets(JSON.parse(storedWallets));
    }
  }, []);

  const saveAccount = (account: Omit<SavedBankAccount, 'id' | 'createdAt'>) => {
    const newAccount: SavedBankAccount = {
      ...account,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updated = account.isDefault 
      ? savedAccounts.map(a => ({ ...a, isDefault: false }))
      : savedAccounts;
    
    const newAccounts = [...updated, newAccount];
    setSavedAccounts(newAccounts);
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(newAccounts));
    return newAccount;
  };

  const removeAccount = (id: string) => {
    const newAccounts = savedAccounts.filter(a => a.id !== id);
    setSavedAccounts(newAccounts);
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(newAccounts));
  };

  const setDefaultAccount = (id: string) => {
    const newAccounts = savedAccounts.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    setSavedAccounts(newAccounts);
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(newAccounts));
  };

  const saveWallet = (wallet: Omit<SavedCryptoWallet, 'id' | 'createdAt'>) => {
    const newWallet: SavedCryptoWallet = {
      ...wallet,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updated = wallet.isDefault 
      ? savedWallets.map(w => ({ ...w, isDefault: false }))
      : savedWallets;
    
    const newWallets = [...updated, newWallet];
    setSavedWallets(newWallets);
    localStorage.setItem(CRYPTO_STORAGE_KEY, JSON.stringify(newWallets));
    return newWallet;
  };

  const removeWallet = (id: string) => {
    const newWallets = savedWallets.filter(w => w.id !== id);
    setSavedWallets(newWallets);
    localStorage.setItem(CRYPTO_STORAGE_KEY, JSON.stringify(newWallets));
  };

  const setDefaultWallet = (id: string) => {
    const newWallets = savedWallets.map(w => ({
      ...w,
      isDefault: w.id === id,
    }));
    setSavedWallets(newWallets);
    localStorage.setItem(CRYPTO_STORAGE_KEY, JSON.stringify(newWallets));
  };

  return {
    savedAccounts,
    savedWallets,
    saveAccount,
    removeAccount,
    setDefaultAccount,
    saveWallet,
    removeWallet,
    setDefaultWallet,
  };
};
