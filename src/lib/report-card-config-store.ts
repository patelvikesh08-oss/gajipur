
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ReportCardConfig {
  templateUrl: string | null;
  templateType: 'pdf' | 'image' | 'default';
  schoolName: string;
  schoolIndex: string;
  districtBlock: string;
  conductItems: { id: string; label: string; checked: boolean }[];
}

const DEFAULT_CONFIG: ReportCardConfig = {
  templateUrl: null,
  templateType: 'default',
  schoolName: 'EduPulse Global Academy',
  schoolIndex: 'SCH-IDX-998877',
  districtBlock: 'Springfield / Central',
  conductItems: [
    { id: "punctuality", label: "Punctuality / સમયપાલન", checked: true },
    { id: "cleanliness", label: "Cleanliness / સ્વચ્છતા", checked: true },
    { id: "behavior", label: "Social Behavior / સામાજિક વર્તન", checked: true },
    { id: "leadership", label: "Leadership / નેતૃત્વ", checked: true },
    { id: "discipline", label: "Discipline / શિસ્ત", checked: true },
  ],
};

export function useReportCardConfigStore() {
  const [config, setConfig] = useState<ReportCardConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_report_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = useCallback((updates: Partial<ReportCardConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem('edupulse_report_config', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, updateConfig, isLoaded };
}
