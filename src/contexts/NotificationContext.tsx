import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'reward';
  read: boolean;
  timestamp: Date;
  points?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper to get user-specific storage key
const getStorageKey = (userId: string) => `studyearn_notifications_${userId}`;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUserId = session?.user?.id ?? null;
        setUserId(newUserId);
        
        if (newUserId) {
          // Load user-specific notifications
          loadNotifications(newUserId);
        } else {
          setNotifications([]);
          setIsInitialized(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUserId = session?.user?.id ?? null;
      setUserId(newUserId);
      
      if (newUserId) {
        loadNotifications(newUserId);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadNotifications = (uid: string) => {
    try {
      const key = getStorageKey(uid);
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(withDates);
      } else {
        // First time user - show only welcome notification
        const welcomeNotification: Notification = {
          id: '1',
          title: 'Welcome to StudyEarn!',
          message: 'Start your learning journey and earn rewards. Complete courses and games to earn points!',
          type: 'success',
          read: false,
          timestamp: new Date(),
          points: 50,
        };
        
        // Check if user has a referral bonus
        const pendingBonus = localStorage.getItem('pending_signup_bonus');
        if (pendingBonus) {
          try {
            const bonusData = JSON.parse(pendingBonus);
            if (bonusData.userId === uid && bonusData.referralCode) {
              const referralNotification: Notification = {
                id: '2',
                title: 'Referral Bonus Applied!',
                message: `You signed up with referral code "${bonusData.referralCode}" and received an extra $${bonusData.referralBonus?.toFixed(2) || '1.00'} bonus!`,
                type: 'reward',
                read: false,
                timestamp: new Date(),
                points: Math.round((bonusData.referralBonus || 1) * 1000),
              };
              setNotifications([referralNotification, welcomeNotification]);
            } else {
              setNotifications([welcomeNotification]);
            }
          } catch {
            setNotifications([welcomeNotification]);
          }
        } else {
          setNotifications([welcomeNotification]);
        }
      }
      setIsInitialized(true);
    } catch {
      setNotifications([]);
      setIsInitialized(true);
    }
  };

  // Persist notifications when they change
  useEffect(() => {
    if (userId && isInitialized) {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(notifications));
    }
  }, [notifications, userId, isInitialized]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show as toast
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
