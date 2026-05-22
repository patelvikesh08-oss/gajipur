
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface PatrakBConfig {
  fieldCount: number;
}

export function usePatrakBStore() {
  const [config, setConfig] = useState<PatrakBConfig>({ fieldCount: 4 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_patrak_b_config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const updateFieldCount = useCallback((count: number) => {
    setConfig({ fieldCount: count });
    localStorage.setItem('edupulse_patrak_b_config', JSON.stringify({ fieldCount: count }));
  }, []);

  return { config, updateFieldCount, isLoaded };
}
