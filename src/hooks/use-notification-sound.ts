import { useCallback, useEffect, useState } from 'react';

interface NotificationSoundSettings {
  enabled: boolean;
  volume: number;
}

const STORAGE_KEY = 'notification-sound-settings';
const DEFAULT_SETTINGS: NotificationSoundSettings = {
  enabled: true,
  volume: 0.5,
};

export function useNotificationSound() {
  const [settings, setSettings] = useState<NotificationSoundSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save notification sound settings:', error);
    }
  }, [settings]);

  const playNotificationSound = useCallback(() => {
    if (!settings.enabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(900, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.1);

        gainNode2.gain.setValueAtTime(settings.volume * 0.8, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.25);

        setTimeout(() => {
          audioContext.close();
        }, 300);
      }, 100);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }, [settings.enabled, settings.volume]);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setSettings((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const testSound = useCallback(() => {
    playNotificationSound();
  }, [playNotificationSound]);

  return {
    settings,
    playNotificationSound,
    toggleSound,
    setVolume,
    testSound,
  };
}

