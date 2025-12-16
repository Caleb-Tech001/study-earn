import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

interface GameLimitState {
  playsToday: number;
  maxPlays: number;
  canPlay: boolean;
  remainingPlays: number | 'unlimited';
  isLoading: boolean;
}

const STORAGE_KEY = 'game_plays';

// Play limits per subscription tier
const PLAY_LIMITS = {
  free: 2,
  basic: 4,
  premium: Infinity,
};

export const useGameLimit = () => {
  const { plan, isLoading: subLoading } = useSubscription();
  const [state, setState] = useState<GameLimitState>({
    playsToday: 0,
    maxPlays: PLAY_LIMITS.free,
    canPlay: true,
    remainingPlays: PLAY_LIMITS.free,
    isLoading: true,
  });

  const getTodayKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `${STORAGE_KEY}_${today}`;
  };

  const loadPlays = useCallback(() => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(todayKey);
    const playsToday = stored ? parseInt(stored, 10) : 0;
    
    // Clean up old entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY) && key !== todayKey) {
        localStorage.removeItem(key);
      }
    });

    return playsToday;
  }, []);

  useEffect(() => {
    if (subLoading) return;

    const playsToday = loadPlays();
    const maxPlays = PLAY_LIMITS[plan] || PLAY_LIMITS.free;
    const canPlay = playsToday < maxPlays;
    const remainingPlays = maxPlays === Infinity ? 'unlimited' : Math.max(0, maxPlays - playsToday);

    setState({
      playsToday,
      maxPlays,
      canPlay,
      remainingPlays,
      isLoading: false,
    });
  }, [plan, subLoading, loadPlays]);

  const recordPlay = useCallback(() => {
    const todayKey = getTodayKey();
    const currentPlays = loadPlays();
    const newPlays = currentPlays + 1;
    localStorage.setItem(todayKey, newPlays.toString());

    const maxPlays = PLAY_LIMITS[plan] || PLAY_LIMITS.free;
    const canPlay = newPlays < maxPlays;
    const remainingPlays = maxPlays === Infinity ? 'unlimited' : Math.max(0, maxPlays - newPlays);

    setState(prev => ({
      ...prev,
      playsToday: newPlays,
      canPlay,
      remainingPlays,
    }));

    return { playsToday: newPlays, canPlay, remainingPlays };
  }, [plan, loadPlays]);

  const getPlanName = () => {
    switch (plan) {
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      default: return 'Free';
    }
  };

  return {
    ...state,
    recordPlay,
    plan,
    planName: getPlanName(),
    playLimits: PLAY_LIMITS,
  };
};
