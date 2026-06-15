import { useState, useEffect } from 'react';
const useRandomMessage = () => {
  const [currentMessage, setCurrentMessage] = useState('');

  const loadingMessages = [
    "Looking for best trips...",
    "Exploring destinations...",
    "Finding your perfect journey...",
    "Discovering hidden gems...",
    "Planning your adventure...",
    "Mapping your route...",
    "Searching for amazing places...",
    "Preparing travel options...",
    "Scanning the globe for you...",
    "Curating your experience...",
    "Loading wonderful destinations...",
    "Getting travel insights ready...",
    "Compiling journey options...",
    "Finding unique experiences...",
    "Preparing your travel guide..."
  ];

  useEffect(() => {
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setCurrentMessage(randomMessage);
    const interval = setInterval(() => {
      const newMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setCurrentMessage(newMessage);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return currentMessage;
};

export default useRandomMessage;