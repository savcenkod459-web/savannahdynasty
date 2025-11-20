import { useState, useEffect } from 'react';

interface DataSaverSettings {
  isEnabled: boolean;
  toggleDataSaver: () => void;
}

export const useDataSaver = (): DataSaverSettings => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('dataSaverMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dataSaverMode', String(isEnabled));
  }, [isEnabled]);

  const toggleDataSaver = () => {
    setIsEnabled(prev => !prev);
  };

  return {
    isEnabled,
    toggleDataSaver,
  };
};
