import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SoundWaveAnimationProps {
  isActive: boolean;
  variant?: 'listening' | 'speaking' | 'thinking';
  className?: string;
}

export const SoundWaveAnimation = ({ isActive, variant = 'listening', className }: SoundWaveAnimationProps) => {
  const barCount = 5;
  
  const getColor = () => {
    switch (variant) {
      case 'listening':
        return 'bg-green-500';
      case 'speaking':
        return 'bg-blue-500';
      case 'thinking':
        return 'bg-yellow-500';
      default:
        return 'bg-primary';
    }
  };

  const getAnimationDelay = (index: number) => {
    return index * 0.1;
  };

  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className={cn("w-0.5 rounded-full", getColor())}
          initial={{ height: 4 }}
          animate={isActive ? {
            height: [4, 12 + Math.random() * 8, 6, 16 + Math.random() * 4, 4],
          } : { height: 4 }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            repeatType: "loop",
            delay: getAnimationDelay(index),
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
