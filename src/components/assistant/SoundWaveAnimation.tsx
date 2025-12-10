import { cn } from '@/lib/utils';

interface SoundWaveAnimationProps {
  isActive: boolean;
  variant?: 'listening' | 'speaking' | 'thinking';
  className?: string;
}

export const SoundWaveAnimation = ({ isActive, variant = 'listening', className }: SoundWaveAnimationProps) => {
  const barCount = 4;
  
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

  return (
    <div className={cn("flex items-center justify-center gap-0.5 h-4", className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-0.5 rounded-full transition-all duration-300",
            getColor(),
            isActive ? "animate-pulse" : "h-1"
          )}
          style={{
            height: isActive ? `${8 + (index % 2) * 4}px` : '4px',
            animationDelay: `${index * 0.15}s`
          }}
        />
      ))}
    </div>
  );
};
