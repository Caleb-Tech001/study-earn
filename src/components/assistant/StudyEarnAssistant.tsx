import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Trash2,
  Brain,
  Sparkles,
  Wallet,
  BookOpen,
  HelpCircle,
  Target,
  Loader2,
  Volume2,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAssistant, AttachmentInfo } from '@/contexts/AssistantContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SoundWaveAnimation } from './SoundWaveAnimation';
import { RealtimeVoiceChat } from './RealtimeVoiceChat';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

const QUICK_ACTIONS = [
  { icon: Wallet, label: 'Show My Balance', prompt: 'What is my current wallet balance and points?' },
  { icon: Target, label: 'Earn Points', prompt: 'How can I earn more points today?' },
  { icon: BookOpen, label: 'Recommend Module', prompt: 'Recommend a learning module for me based on my interests' },
  { icon: HelpCircle, label: 'How to Withdraw', prompt: 'How do I withdraw my earnings to my bank account?' },
  { icon: Sparkles, label: 'Today\'s Tasks', prompt: 'What tasks can I complete today to earn rewards?' },
  { icon: Brain, label: 'Help With Assignment', prompt: 'I need help with my current assignment. Can you assist?' },
];

export const StudyEarnAssistant = () => {
  const { 
    messages, 
    isOpen, 
    isLoading, 
    setIsOpen, 
    sendMessage, 
    clearMessages,
    getUserContext 
  } = useAssistant();
  
  const { user } = useAuth();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [realtimeVoiceOpen, setRealtimeVoiceOpen] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { toast } = useToast();

  // Handle FAB click - check auth first
  const handleFabClick = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in or sign up to use the AI assistant.',
      });
      return;
    }
    setIsOpen(true);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Track speaking state - clear speakingMessageId when TTS stops
  useEffect(() => {
    if (!isSpeaking && speakingMessageId) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking, speakingMessageId]);

  // Handle speaking a specific message (per-response TTS)
  const handleSpeakMessage = (messageId: string, content: string) => {
    if (speakingMessageId === messageId && isSpeaking) {
      // Stop speaking this message
      stop();
      setSpeakingMessageId(null);
    } else {
      // Stop any current speech and speak this message
      if (isSpeaking) {
        stop();
      }
      setSpeakingMessageId(messageId);
      speak(content);
    }
  };

  // Initialize speech recognition for voice input
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: 'Voice Input Error',
          description: 'Could not process voice input. Please try again.',
          variant: 'destructive',
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Voice input is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: 'Listening...',
        description: 'Speak now. Click the mic again to stop.',
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentInfo[] = [];
    
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds 5MB limit.`,
          variant: 'destructive',
        });
        continue;
      }

      // Convert images to base64 for vision
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          newAttachments.push({
            name: file.name,
            type: file.type,
            size: file.size,
            preview: base64,
            base64: base64,
          });
        } catch (error) {
          console.error('Error reading file:', error);
          toast({
            title: 'File Error',
            description: `Could not read ${file.name}.`,
            variant: 'destructive',
          });
        }
      } else {
        newAttachments.push({
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
    }

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
      toast({
        title: 'Attachment Added',
        description: `${newAttachments.length} file(s) ready to analyze.`,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    // Stop any playing audio when user sends a message
    if (isSpeaking) {
      stop();
    }

    const messageContent = attachments.length > 0
      ? `${input}\n\n[Attached files: ${attachments.map(a => a.name).join(', ')}]`
      : input;

    setInput('');
    setAttachments([]);
    await sendMessage(messageContent, attachments);
  };

  const handleQuickAction = async (prompt: string) => {
    if (isSpeaking) {
      stop();
    }
    await sendMessage(prompt);
  };

  const context = getUserContext();

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={handleFabClick}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-primary to-primary/80 hover:scale-110 hover:shadow-xl",
          isOpen && "scale-0 opacity-0"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        aria-label="Open StudyEarn Assistant"
      >
        <Brain className="h-7 w-7 text-primary-foreground" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[420px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">StudyEarn Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    {context.currentPage} • {context.pointsBalance.toLocaleString()} pts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRealtimeVoiceOpen(true)}
                  className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  title="Start real-time voice conversation"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearMessages}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-2 font-display font-semibold text-foreground">
                    Hi {context.userName}! 👋
                  </h4>
                  <p className="mb-6 text-sm text-muted-foreground">
                    I'm your StudyEarn companion. How can I help you learn and earn today?
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid w-full grid-cols-2 gap-2">
                    {QUICK_ACTIONS.slice(0, 4).map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <action.icon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {/* Display image attachments */}
                        {message.attachments && message.attachments.some(a => a.preview) && (
                          <div className="mb-2 flex flex-wrap gap-2">
                            {message.attachments
                              .filter(att => att.preview)
                              .map((att, i) => (
                                <img
                                  key={i}
                                  src={att.preview}
                                  alt={att.name}
                                  className="max-h-40 max-w-full rounded-lg object-contain"
                                />
                              ))}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content || (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Thinking...
                          </span>
                        )}</p>
                        {/* Show non-image attachments */}
                        {message.attachments && message.attachments.filter(a => !a.preview).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.attachments
                              .filter(att => !att.preview)
                              .map((att, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-background/20 px-2 py-0.5 text-xs"
                                >
                                  📎 {att.name}
                                </span>
                              ))}
                          </div>
                        )}
                        
                        {/* TTS button for assistant messages - like CropGuard */}
                        {message.role === 'assistant' && message.content && (
                          <button
                            onClick={() => handleSpeakMessage(message.id, message.content)}
                            className={cn(
                              "mt-2 flex items-center gap-1 text-xs transition-colors",
                              speakingMessageId === message.id && isSpeaking
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Volume2 className={cn(
                              "h-3.5 w-3.5",
                              speakingMessageId === message.id && isSpeaking && "animate-pulse"
                            )} />
                            {speakingMessageId === message.id && isSpeaking ? "Stop" : "Listen"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-muted-foreground">Analyzing...</span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Quick Actions Bar (when messages exist) */}
            {messages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-t border-border bg-muted/30 px-4 py-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isLoading}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <action.icon className="h-3 w-3 text-primary" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex gap-2 border-t border-border bg-muted/50 px-4 py-2">
                {attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 rounded-lg bg-background px-2 py-1 text-xs"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-20 truncate">{att.name}</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 w-9 shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={cn(
                    "h-9 w-9 shrink-0 relative",
                    isRecording && "bg-destructive/10 text-destructive"
                  )}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? (
                    <div className="flex items-center justify-center">
                      <SoundWaveAnimation isActive={true} variant="listening" className="absolute" />
                      <MicOff className="h-4 w-4 opacity-0" />
                    </div>
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && attachments.length === 0)}
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Realtime Voice Chat Modal */}
      <RealtimeVoiceChat
        isOpen={realtimeVoiceOpen}
        onClose={() => setRealtimeVoiceOpen(false)}
        userContext={{
          userName: context.userName,
          userRole: context.role,
          pointsBalance: context.pointsBalance,
          currentPage: context.currentPage,
        }}
      />
    </>
  );
};
