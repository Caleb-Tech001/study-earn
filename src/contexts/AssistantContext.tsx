import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/contexts/WalletContext';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: AttachmentInfo[];
}

export interface AttachmentInfo {
  name: string;
  type: string;
  size: number;
  preview?: string;
}

interface UserContext {
  currentPage: string;
  walletBalance: number;
  pointsBalance: number;
  streak: number;
  role: string;
  userName: string;
  recentActivity: string;
  attachmentInfo?: string;
}

interface AssistantContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  sendMessage: (content: string, attachments?: AttachmentInfo[]) => Promise<void>;
  clearMessages: () => void;
  getUserContext: () => UserContext;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const PAGE_NAMES: Record<string, string> = {
  '/learner/dashboard': 'Learner Dashboard',
  '/learner/modules': 'My Modules',
  '/learner/wallet': 'Wallet',
  '/learner/marketplace': 'Marketplace',
  '/learner/community': 'Community',
  '/learner/profile': 'Profile',
  '/learner/settings': 'Settings',
  '/learner/leaderboard': 'Leaderboard',
  '/learner/activity': 'Activity Log',
  '/instructor/dashboard': 'Instructor Dashboard',
  '/institution/dashboard': 'Institution Dashboard',
  '/admin': 'Admin Dashboard',
};

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { balance, pointsBalance } = useWallet();

  // Load messages from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('studyearn-assistant-messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('studyearn-assistant-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const getUserContext = useCallback((): UserContext => {
    const pageName = PAGE_NAMES[location.pathname] || location.pathname;
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
    const role = user?.user_metadata?.role || 'learner';

    return {
      currentPage: pageName,
      walletBalance: balance,
      pointsBalance: pointsBalance,
      streak: 7, // Simulated
      role,
      userName,
      recentActivity: 'Completed "Introduction to Financial Literacy" module',
    };
  }, [location.pathname, user, balance, pointsBalance]);

  const sendMessage = useCallback(async (content: string, attachments?: AttachmentInfo[]) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const userContext = getUserContext();
      if (attachments && attachments.length > 0) {
        userContext.attachmentInfo = attachments.map(a => `${a.name} (${a.type})`).join(', ');
      }

      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/studyearn-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...conversationHistory, { role: 'user', content }],
          userContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => prev.map(m => 
                m.id === assistantId ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            // Incomplete JSON, will be handled in next chunk
          }
        }
      }
    } catch (error) {
      console.error('Assistant error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💫",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, getUserContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem('studyearn-assistant-messages');
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        setIsOpen,
        sendMessage,
        clearMessages,
        getUserContext,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
