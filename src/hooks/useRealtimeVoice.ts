import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserContext {
  userName?: string;
  userRole?: string;
  pointsBalance?: number;
  currentPage?: string;
}

interface RealtimeVoiceState {
  isConnecting: boolean;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}

export const useRealtimeVoice = (userContext?: UserContext) => {
  const [state, setState] = useState<RealtimeVoiceState>({
    isConnecting: false,
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
  });

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      setState(s => ({ ...s, isConnecting: true, error: null }));
      console.log('Starting realtime voice connection...');

      // Get ephemeral token from our edge function
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('realtime-voice-session', {
        body: { userContext },
      });

      if (tokenError) {
        console.error('Token error:', tokenError);
        throw new Error('Failed to get session token');
      }

      if (!tokenData?.client_secret?.value) {
        console.error('No client secret in response:', tokenData);
        throw new Error('Failed to get ephemeral token');
      }

      const EPHEMERAL_KEY = tokenData.client_secret.value;
      console.log('Got ephemeral token, setting up WebRTC...');

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Create audio element for remote audio
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElRef.current = audioEl;

      // Set up remote audio
      pc.ontrack = (e) => {
        console.log('Received remote track:', e.track.kind);
        audioEl.srcObject = e.streams[0];
        setState(s => ({ ...s, isSpeaking: true }));
      };

      // Get local audio
      console.log('Requesting microphone access...');
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      localStreamRef.current = localStream;

      // Add local track
      const audioTrack = localStream.getTracks()[0];
      pc.addTrack(audioTrack, localStream);
      console.log('Added local audio track');

      // Set up data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.addEventListener('open', () => {
        console.log('Data channel opened');
        setState(s => ({ ...s, isListening: true }));
      });

      dc.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('Received event:', event.type);

          // Track speaking state
          if (event.type === 'response.audio.delta') {
            setState(s => ({ ...s, isSpeaking: true, isListening: false }));
          } else if (event.type === 'response.audio.done' || event.type === 'response.done') {
            setState(s => ({ ...s, isSpeaking: false, isListening: true }));
          } else if (event.type === 'input_audio_buffer.speech_started') {
            setState(s => ({ ...s, isListening: true, isSpeaking: false }));
          }
        } catch (err) {
          console.error('Error parsing event:', err);
        }
      });

      dc.addEventListener('close', () => {
        console.log('Data channel closed');
      });

      dc.addEventListener('error', (e) => {
        console.error('Data channel error:', e);
      });

      // Create and set local description
      console.log('Creating offer...');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      console.log('Sending SDP to OpenAI...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('SDP response error:', sdpResponse.status, errorText);
        throw new Error(`Failed to connect: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      console.log('Received SDP answer, setting remote description...');
      
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };
      
      await pc.setRemoteDescription(answer);
      console.log('WebRTC connection established!');

      setState(s => ({ 
        ...s, 
        isConnecting: false, 
        isConnected: true,
        isListening: true,
      }));

    } catch (error) {
      console.error('Connection error:', error);
      setState(s => ({ 
        ...s, 
        isConnecting: false, 
        isConnected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
      
      // Cleanup on error
      disconnect();
    }
  }, [userContext]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting realtime voice...');

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close data channel
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Remove audio element
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }

    setState({
      isConnecting: false,
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      error: null,
    });
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') {
      console.error('Data channel not ready');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    dcRef.current.send(JSON.stringify(event));
    dcRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sendTextMessage,
  };
};
