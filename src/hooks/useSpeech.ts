import { useState, useCallback, useEffect } from 'react';

interface UseSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechReturn {
  speak: (text: string, options?: UseSpeechOptions) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

/**
 * Hook to use Web Speech API for text-to-speech
 * @param defaultLang - Default language code (e.g., 'en-US', 'vi-VN')
 */
export function useSpeech(defaultLang = 'en-US'): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Voices are loaded async in some browsers
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text: string, options?: UseSpeechOptions) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    const lang = options?.lang || defaultLang;
    utterance.lang = lang;
    
    // Try to find a voice for the language
    const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) 
      || voices.find(v => v.lang.includes('en'));
    if (voice) {
      utterance.voice = voice;
    }

    // Set other options
    utterance.rate = options?.rate ?? 0.9; // Slightly slower for learning
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 1;

    // Event listeners
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, defaultLang]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
}

/**
 * Get the appropriate language code for speech based on language name
 */
export function getLanguageCodeForSpeech(languageName: string): string {
  const languageMap: Record<string, string> = {
    'english': 'en-US',
    'vietnamese': 'vi-VN',
    'japanese': 'ja-JP',
    'korean': 'ko-KR',
    'chinese': 'zh-CN',
    'french': 'fr-FR',
    'german': 'de-DE',
    'spanish': 'es-ES',
    'italian': 'it-IT',
    'portuguese': 'pt-BR',
    'russian': 'ru-RU',
    'thai': 'th-TH',
  };

  const normalized = languageName.toLowerCase();
  return languageMap[normalized] || 'en-US';
}
