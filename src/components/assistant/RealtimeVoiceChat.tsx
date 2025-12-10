import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, Volume2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UserContext {
  userName?: string;
  userRole?: string;
  pointsBalance?: number;
  currentPage?: string;
}

interface RealtimeVoiceChatProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: UserContext;
}

export const RealtimeVoiceChat = ({ isOpen, onClose, userContext }: RealtimeVoiceChatProps) => {
  const { toast } = useToast();
  const {
    isConnecting,
    isConnected,
    isListening,
    isSpeaking,
    error,
    connect,
    disconnect,
  } = useRealtimeVoice(userContext);

  // Connect when opened
  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      connect();
    }
  }, [isOpen, isConnected, isConnecting, connect]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Voice Connection Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleClose = useCallback(() => {
    disconnect();
    onClose();
  }, [disconnect, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="relative flex flex-col items-center justify-center gap-8 rounded-3xl bg-card p-12 shadow-2xl border border-border"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Status indicator */}
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Voice Conversation
            </h2>
            <p className="text-sm text-muted-foreground">
              {isConnecting && 'Connecting...'}
              {isConnected && isListening && 'Listening to you...'}
              {isConnected && isSpeaking && 'Speaking...'}
              {!isConnecting && !isConnected && 'Ready to connect'}
            </p>
          </div>

          {/* Visual indicator */}
          <div className="relative">
            {/* Outer ring animations */}
            {isConnected && (
              <>
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full",
                    isListening ? "bg-green-500/20" : "bg-primary/20"
                  )}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ width: 180, height: 180, marginLeft: -30, marginTop: -30 }}
                />
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full",
                    isListening ? "bg-green-500/30" : "bg-primary/30"
                  )}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 0.2, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  style={{ width: 160, height: 160, marginLeft: -20, marginTop: -20 }}
                />
              </>
            )}

            {/* Main circle */}
            <motion.div
              className={cn(
                "relative flex h-[120px] w-[120px] items-center justify-center rounded-full transition-colors",
                isConnecting && "bg-muted",
                isConnected && isListening && "bg-green-500",
                isConnected && isSpeaking && "bg-primary",
                !isConnecting && !isConnected && "bg-muted"
              )}
              animate={isConnected ? {
                scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
              } : {}}
              transition={{
                duration: isSpeaking ? 0.5 : 1,
                repeat: isConnected ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {isConnecting ? (
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
              ) : isConnected && isListening ? (
                <Mic className="h-12 w-12 text-white" />
              ) : isConnected && isSpeaking ? (
                <Volume2 className="h-12 w-12 text-primary-foreground" />
              ) : (
                <Phone className="h-12 w-12 text-muted-foreground" />
              )}
            </motion.div>
          </div>

          {/* Sound wave visualization when speaking */}
          {isConnected && isSpeaking && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}

          {/* Sound wave visualization when listening */}
          {isConnected && isListening && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-500 rounded-full"
                  animate={{
                    height: [8, 16, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}

          {/* End call button */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full px-8"
            onClick={handleClose}
          >
            <PhoneOff className="h-5 w-5 mr-2" />
            End Conversation
          </Button>

          {/* Tips */}
          <p className="text-xs text-muted-foreground text-center max-w-[280px]">
            Speak naturally and I'll respond. Say "goodbye" or click end to finish.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
