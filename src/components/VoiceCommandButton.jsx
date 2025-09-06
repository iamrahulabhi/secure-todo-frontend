import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
  mic.continuous = false;
  mic.interimResults = false;
  mic.lang = 'en-US';
}

export default function VoiceCommandButton({ onResult, children }) {
  const [isListening, setIsListening] = useState(false);

  const handleListen = () => {
    if (!mic) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      mic.stop();
    } else {
      mic.start();
    }
  };

  useEffect(() => {
    if (!mic) return;

    const handleOnResult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      onResult(transcript);
      setIsListening(false);
    };

    const handleOnStart = () => setIsListening(true);
    const handleOnEnd = () => setIsListening(false);
    const handleOnError = (event) => console.error('Speech recognition error', event.error);

    mic.addEventListener('result', handleOnResult);
    mic.addEventListener('start', handleOnStart);
    mic.addEventListener('end', handleOnEnd);
    mic.addEventListener('error', handleOnError);

    // Cleanup function
    return () => {
      mic.removeEventListener('result', handleOnResult);
      mic.removeEventListener('start', handleOnStart);
      mic.removeEventListener('end', handleOnEnd);
      mic.removeEventListener('error', handleOnError);
    };
  }, [onResult]);
  
  // Render whatever UI the parent component provides
  return children(handleListen, isListening);
}