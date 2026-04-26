import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioElementRef = useRef(null);

  const toggleAudio = () => setIsAudioPlaying((prev) => !prev);

  useEffect(() => {
    if (isAudioPlaying) {
      if (audioElementRef.current) {
        audioElementRef.current.play().catch(() => setIsAudioPlaying(false));
      }
    } else {
      if (audioElementRef.current) audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  return (
    <AudioContext.Provider value={{ isAudioPlaying, toggleAudio }}>
      {/* Global persistent audio element */}
      <audio
        ref={audioElementRef}
        className="hidden"
        src="/audio/loop.mp3"
        loop
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
