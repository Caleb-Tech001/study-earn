import { useState, useCallback, useRef, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
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

      // Limit text length for browser TTS
      const truncatedText = cleanText.length > 2500 ? cleanText.substring(0, 2500) + '...' : cleanText;

      console.log('Speaking with browser TTS:', truncatedText.substring(0, 50) + '...');

      const utterance = new SpeechSynthesisUtterance(truncatedText);
      utteranceRef.current = utterance;

      // Select a good voice - prefer Google or premium voices
      const preferredVoice = voices.find(
        (v) => v.name.includes('Google') && v.lang.startsWith('en')
      ) || voices.find(
        (v) => v.name.includes('Samantha') || v.name.includes('Microsoft Zira') || v.name.includes('Microsoft David')
      ) || voices.find(v => v.lang.startsWith('en-US')) 
        || voices.find(v => v.lang.startsWith('en')) 
        || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name);
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking, voices]);

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
