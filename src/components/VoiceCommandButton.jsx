import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
  mic.continuous = false;
  mic.interimResults = false;
  mic.lang = 'en-US';
}

export default function VoiceCommandButton({ onResult }) {
  const [isListening, setIsListening] = useState(false);

  const handleListen = () => {
    if (!mic) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      mic.stop();
      setIsListening(false);
    } else {
      mic.start();
      setIsListening(true);
    }
  };

  if (mic) {
    mic.onend = () => {
      setIsListening(false);
    };

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      onResult(transcript); // Send the final text back to the parent component
      mic.stop();
      setIsListening(false);
    };

    mic.onerror = event => {
      console.error(event.error);
      mic.stop();
      setIsListening(false);
    };
  }

  return (
    <Tooltip title={isListening ? "Stop Listening" : "Add Task with Voice"}>
      <IconButton onClick={handleListen} color={isListening ? "error" : "primary"}>
        {isListening ? <MicOffIcon /> : <MicIcon />}
      </IconButton>
    </Tooltip>
  );
}