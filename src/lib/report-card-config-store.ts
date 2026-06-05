'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FieldMapping {
  field: string;
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface ReportCardConfig {
  templateUrlPage1: string | null;
  templateUrlPage2: string | null;
  fieldMappingsPage1: FieldMapping[];
  fieldMappingsPage2: FieldMapping[];
  templateType: 'pdf' | 'image' | 'default';
  schoolName: string;
  schoolIndex: string;
  districtBlock: string;
  conductItems: { id: string; label: string; checked: boolean }[];
}

const DEFAULT_CONFIG: ReportCardConfig = {
  templateUrlPage1: null,
  templateUrlPage2: null,
  fieldMappingsPage1: [],
  fieldMappingsPage2: [],
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
    const saved = localStorage.getItem('edupulse_report_config_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch (e) {
        console.error("Failed to load config", e);
      }
    } else {
      // Migration from v1
      const oldSaved = localStorage.getItem('edupulse_report_config');
      if (oldSaved) {
        try {
          const parsed = JSON.parse(oldSaved);
          const migrated = {
            ...DEFAULT_CONFIG,
            ...parsed,
            templateUrlPage1: parsed.templateUrl,
            fieldMappingsPage1: parsed.fieldMappings || []
          };
          setConfig(migrated);
        } catch (e) {}
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = useCallback((updates: Partial<ReportCardConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem('edupulse_report_config_v2', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, updateConfig, isLoaded };
}
