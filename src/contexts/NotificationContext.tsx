import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome to StudyEarn!',
    message: 'Start your learning journey and earn rewards. Complete the quick start guide to earn your first 50 points!',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    points: 50,
  },
  {
    id: '2',
    title: 'You earned 20 points!',
    message: 'Congratulations! You earned 20 points for completing a quiz.',
    type: 'reward',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    points: 20,
  },
  {
    id: '3',
    title: 'Word Game Level 1 Completed!',
    message: 'Amazing work! You completed Level 1 of the word game and earned 15 points.',
    type: 'reward',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    points: 15,
  },
  {
    id: '4',
    title: 'New Module Unlocked',
    message: 'You\'ve unlocked the Advanced Python Programming module. Start learning now!',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '5',
    title: 'You earned a badge!',
    message: 'Congratulations! You earned the "7 Day Streak" badge for consistent learning.',
    type: 'reward',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: '6',
    title: 'Withdrawal Processing',
    message: 'Your withdrawal request of $50 is being processed. Funds will arrive in 2-3 business days.',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
  },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();

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
