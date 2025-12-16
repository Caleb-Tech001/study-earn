import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWallet } from '@/contexts/WalletContext';
import { useSavedBankAccounts, SavedBankAccount, SavedCryptoWallet } from '@/hooks/useSavedBankAccounts';
import { nigerianBanks, cryptoExchanges, usdToNaira } from '@/utils/bankData';
import { Building2, Bitcoin, ArrowRight, Check, Loader2, Plus, Trash2, Star } from 'lucide-react';

interface WithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  balance: number;
}

export const WithdrawalModal = ({ open, onClose, balance }: WithdrawalModalProps) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { processWithdrawal } = useWallet();
  const {
    savedAccounts,
    savedWallets,
    saveAccount,
    removeAccount,
    setDefaultAccount,
    saveWallet,
    removeWallet,
    setDefaultWallet,
  } = useSavedBankAccounts();

  const [step, setStep] = useState(1);
  const [withdrawType, setWithdrawType] = useState<'bank' | 'crypto'>('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [showNewWalletForm, setShowNewWalletForm] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  
  // Selected saved account
  const [selectedSavedAccount, setSelectedSavedAccount] = useState<SavedBankAccount | null>(null);
  const [selectedSavedWallet, setSelectedSavedWallet] = useState<SavedCryptoWallet | null>(null);
  
  // Bank withdrawal state
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Crypto withdrawal state
  const [selectedExchange, setSelectedExchange] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');

  // No fees for withdrawals
  const amountNum = parseFloat(amount) || 0;
  const nairaEquivalent = amountNum * usdToNaira;
  const finalAmount = amountNum; // No fee deduction

  // Auto-select default account on open
  useState(() => {
    const defaultAccount = savedAccounts.find(a => a.isDefault);
    const defaultWallet = savedWallets.find(w => w.isDefault);
    if (defaultAccount) setSelectedSavedAccount(defaultAccount);
    if (defaultWallet) setSelectedSavedWallet(defaultWallet);
  });

  const handleVerifyAccount = () => {
    if (accountNumber.length !== 10) {
      toast({
        title: 'Invalid Account Number',
        description: 'Please enter a valid 10-digit account number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const names = ['Caleb Oladepo', 'Adewale Okonkwo', 'Chukwuemeka Eze', 'Oluwaseun Abiodun'];
      setAccountName(names[Math.floor(Math.random() * names.length)]);
      setAccountVerified(true);
      setIsLoading(false);
      toast({
        title: 'Account Verified',
        description: 'Account name fetched successfully',
      });
    }, 1500);
  };

  const handleSaveAccount = () => {
    const bankInfo = nigerianBanks.find(b => b.code === selectedBank);
    if (!bankInfo || !accountName) return;

    saveAccount({
      bankCode: selectedBank,
      bankName: bankInfo.name,
      accountNumber,
      accountName,
      isDefault: saveAsDefault,
    });

    toast({
      title: 'Account Saved',
      description: 'Bank account saved for future withdrawals',
    });

    setShowNewAccountForm(false);
    setSaveAsDefault(false);
  };

  const handleSaveWallet = () => {
    const exchangeInfo = cryptoExchanges.find(e => e.code === selectedExchange);
    if (!exchangeInfo || !walletAddress || !selectedNetwork) return;

    saveWallet({
      exchangeCode: selectedExchange,
      exchangeName: exchangeInfo.name,
      network: selectedNetwork,
      walletAddress,
      label: walletLabel || `${exchangeInfo.name} - ${selectedNetwork}`,
      isDefault: saveAsDefault,
    });

    toast({
      title: 'Wallet Saved',
      description: 'Crypto wallet saved for future withdrawals',
    });

    setShowNewWalletForm(false);
    setSaveAsDefault(false);
  };

  const handleSelectSavedAccount = (account: SavedBankAccount) => {
    setSelectedSavedAccount(account);
    setSelectedBank(account.bankCode);
    setAccountNumber(account.accountNumber);
    setAccountName(account.accountName);
    setAccountVerified(true);
    setShowNewAccountForm(false);
  };

  const handleSelectSavedWallet = (wallet: SavedCryptoWallet) => {
    setSelectedSavedWallet(wallet);
    setSelectedExchange(wallet.exchangeCode);
    setSelectedNetwork(wallet.network);
    setWalletAddress(wallet.walletAddress);
    setShowNewWalletForm(false);
  };

  const handleSubmitWithdrawal = () => {
    if (amountNum > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough funds for this withdrawal',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum < 5) {
      toast({
        title: 'Minimum Withdrawal',
        description: 'Minimum withdrawal amount is $5.00',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Process the withdrawal - deduct balance and add transaction
      const description = withdrawType === 'bank' 
        ? `Bank Transfer - ${selectedSavedAccount?.bankName || nigerianBanks.find(b => b.code === selectedBank)?.name || 'Bank'}`
        : `Crypto - ${selectedNetwork.toUpperCase()}`;
      
      processWithdrawal(amountNum, description);
      
      setIsLoading(false);
      setStep(3);
      
      addNotification({
        title: 'Withdrawal Processing',
        message: `Your withdrawal of $${amountNum.toFixed(2)} is being processed. ${
          withdrawType === 'bank' ? 'Funds will arrive in 2-3 business days.' : 'Transaction will be confirmed shortly.'
        }`,
        type: 'info',
      });

      toast({
        title: 'Withdrawal Submitted!',
        description: 'Your request is being processed',
      });
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setAccountVerified(false);
    setSelectedExchange('');
    setSelectedNetwork('');
    setWalletAddress('');
    setWalletLabel('');
    setShowNewAccountForm(false);
    setShowNewWalletForm(false);
    setSelectedSavedAccount(null);
    setSelectedSavedWallet(null);
    setSaveAsDefault(false);
    onClose();
  };

  const canProceedBank = withdrawType === 'bank' && (selectedSavedAccount || accountVerified) && amount;
  const canProceedCrypto = withdrawType === 'crypto' && (selectedSavedWallet || (selectedNetwork && walletAddress)) && amount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === 3 ? 'Withdrawal Submitted' : 'Withdraw Funds'}
          </DialogTitle>
        </DialogHeader>

        {step === 3 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Request Submitted!</h3>
            <p className="mb-6 text-muted-foreground">
              Your withdrawal of <span className="font-bold">${amountNum.toFixed(2)}</span> is being processed.
              {withdrawType === 'bank' && (
                <span className="block mt-2">≈ ₦{nairaEquivalent.toLocaleString()}</span>
              )}
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <Tabs value={withdrawType} onValueChange={(v) => {
                setWithdrawType(v as 'bank' | 'crypto');
                setShowNewAccountForm(false);
                setShowNewWalletForm(false);
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bank" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Crypto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bank" className="space-y-4 mt-4">
                  {/* Saved Bank Accounts */}
                  {savedAccounts.length > 0 && !showNewAccountForm && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Saved Accounts</Label>
                      <div className="space-y-2">
                        {savedAccounts.map((account) => (
                          <Card 
                            key={account.id}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedSavedAccount?.id === account.id 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:border-muted-foreground/30'
                            }`}
                            onClick={() => handleSelectSavedAccount(account)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  <Building2 className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{account.accountName}</span>
                                    {account.isDefault && (
                                      <Badge variant="secondary" className="text-xs">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {account.bankName} • ****{account.accountNumber.slice(-4)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {selectedSavedAccount?.id === account.id && (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDefaultAccount(account.id);
                                    toast({ title: 'Default account updated' });
                                  }}
                                >
                                  <Star className={`h-4 w-4 ${account.isDefault ? 'fill-primary text-primary' : ''}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAccount(account.id);
                                    if (selectedSavedAccount?.id === account.id) {
                                      setSelectedSavedAccount(null);
                                    }
                                    toast({ title: 'Account removed' });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          setShowNewAccountForm(true);
                          setSelectedSavedAccount(null);
                          setSelectedBank('');
                          setAccountNumber('');
                          setAccountName('');
                          setAccountVerified(false);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Account
                      </Button>
                    </div>
                  )}

                  {/* New Account Form */}
                  {(showNewAccountForm || savedAccounts.length === 0) && (
                    <div className="space-y-4">
                      {savedAccounts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewAccountForm(false)}
                        >
                          ← Back to saved accounts
                        </Button>
                      )}
                      
                      <div>
                        <Label>Select Bank</Label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose your bank" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-card">
                            {nigerianBanks.map((bank) => (
                              <SelectItem key={bank.code} value={bank.code}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Account Number</Label>
                        <div className="mt-1 flex gap-2">
                          <Input
                            value={accountNumber}
                            onChange={(e) => {
                              setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                              setAccountVerified(false);
                              setAccountName('');
                            }}
                            placeholder="Enter 10-digit account number"
                            maxLength={10}
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleVerifyAccount}
                            disabled={!selectedBank || accountNumber.length !== 10 || isLoading}
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                          </Button>
                        </div>
                      </div>

                      {accountVerified && (
                        <>
                          <Card className="border-success bg-success/5 p-3">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              <span className="font-medium">{accountName}</span>
                            </div>
                          </Card>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="saveAccount"
                              checked={saveAsDefault}
                              onCheckedChange={(checked) => setSaveAsDefault(checked as boolean)}
                            />
                            <label htmlFor="saveAccount" className="text-sm cursor-pointer">
                              Save this account for future withdrawals
                            </label>
                          </div>

                          {saveAsDefault && (
                            <Button variant="secondary" onClick={handleSaveAccount} className="w-full">
                              Save Account
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="crypto" className="space-y-4 mt-4">
                  {/* Saved Crypto Wallets */}
                  {savedWallets.length > 0 && !showNewWalletForm && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Saved Wallets</Label>
                      <div className="space-y-2">
                        {savedWallets.map((wallet) => (
                          <Card 
                            key={wallet.id}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedSavedWallet?.id === wallet.id 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:border-muted-foreground/30'
                            }`}
                            onClick={() => handleSelectSavedWallet(wallet)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  <Bitcoin className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{wallet.label}</span>
                                    {wallet.isDefault && (
                                      <Badge variant="secondary" className="text-xs">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-6)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {selectedSavedWallet?.id === wallet.id && (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDefaultWallet(wallet.id);
                                    toast({ title: 'Default wallet updated' });
                                  }}
                                >
                                  <Star className={`h-4 w-4 ${wallet.isDefault ? 'fill-primary text-primary' : ''}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeWallet(wallet.id);
                                    if (selectedSavedWallet?.id === wallet.id) {
                                      setSelectedSavedWallet(null);
                                    }
                                    toast({ title: 'Wallet removed' });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          setShowNewWalletForm(true);
                          setSelectedSavedWallet(null);
                          setSelectedExchange('');
                          setSelectedNetwork('');
                          setWalletAddress('');
                          setWalletLabel('');
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Wallet
                      </Button>
                    </div>
                  )}

                  {/* New Wallet Form */}
                  {(showNewWalletForm || savedWallets.length === 0) && (
                    <div className="space-y-4">
                      {savedWallets.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewWalletForm(false)}
                        >
                          ← Back to saved wallets
                        </Button>
                      )}

                      <div>
                        <Label>Select Exchange</Label>
                        <Select value={selectedExchange} onValueChange={(v) => {
                          setSelectedExchange(v);
                          setSelectedNetwork('');
                        }}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose exchange" />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            {cryptoExchanges.map((ex) => (
                              <SelectItem key={ex.code} value={ex.code}>
                                {ex.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedExchange && (
                        <div>
                          <Label>Select Network</Label>
                          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose network" />
                            </SelectTrigger>
                            <SelectContent className="bg-card">
                              {cryptoExchanges
                                .find(ex => ex.code === selectedExchange)
                                ?.networks.map((network) => (
                                  <SelectItem key={network} value={network}>
                                    {network}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Wallet Address</Label>
                        <Input
                          className="mt-1 font-mono text-sm"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          placeholder="Enter your wallet address"
                        />
                      </div>

                      <div>
                        <Label>Label (Optional)</Label>
                        <Input
                          className="mt-1"
                          value={walletLabel}
                          onChange={(e) => setWalletLabel(e.target.value)}
                          placeholder="e.g., My Binance USDT"
                        />
                      </div>

                      {selectedNetwork && walletAddress && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="saveWallet"
                              checked={saveAsDefault}
                              onCheckedChange={(checked) => setSaveAsDefault(checked as boolean)}
                            />
                            <label htmlFor="saveWallet" className="text-sm cursor-pointer">
                              Save this wallet for future withdrawals
                            </label>
                          </div>

                          {saveAsDefault && (
                            <Button variant="secondary" onClick={handleSaveWallet} className="w-full">
                              Save Wallet
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </TabsContent>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Amount (USD)</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={5}
                      max={balance}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available: ${balance.toFixed(2)}
                    </p>
                  </div>

                  {amountNum > 0 && (
                    <Card className="bg-muted/30 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Amount</span>
                        <span>${amountNum.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>You'll receive</span>
                        <span>${finalAmount.toFixed(2)}</span>
                      </div>
                      {withdrawType === 'bank' && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Naira equivalent</span>
                          <span>≈ ₦{(finalAmount * usdToNaira).toLocaleString()}</span>
                        </div>
                      )}
                    </Card>
                  )}

                  <Button 
                    className="w-full"
                    disabled={!(canProceedBank || canProceedCrypto) || isLoading}
                    onClick={handleSubmitWithdrawal}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Confirm Withdrawal
                  </Button>
                </div>
              </Tabs>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
