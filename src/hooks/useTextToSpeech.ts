import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(async (text: string) => {
    if (!text || isSpeaking) return;

    try {
      setIsSpeaking(true);

      // Stop any currently playing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Clean text for TTS (remove emojis, markdown, etc.)
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/`{1,3}/g, '')
        .trim();

      if (!cleanText) {
        setIsSpeaking(false);
        return;
      }

      // Limit text length
      const truncatedText = cleanText.length > 2500 ? cleanText.substring(0, 2500) + '...' : cleanText;

      console.log('Calling text-to-speech edge function...');
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: truncatedText },
      });

      console.log('TTS response:', { data, error });

      if (error) {
        console.error('TTS edge function error:', error);
        throw error;
      }

      // Use browser's built-in speech synthesis
      if (data?.useBrowserTTS && data?.text) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utteranceRef.current = utterance;

        // Get available voices and select a good one
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Microsoft')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
