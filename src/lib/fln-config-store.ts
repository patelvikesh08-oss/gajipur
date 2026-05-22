
"use client";

import { useState, useEffect, useCallback } from 'react';

export type FLNCategory = 'FOUNDATION' | 'LITERACY' | 'NUMERICY';

export interface FLNConfig {
  categories: Record<FLNCategory, string[]>;
}

const DEFAULT_MILESTONES = [
  "Recognizes letters and sounds",
  "Blends simple CV words",
  "Reads 20+ sight words",
  "Understands basic word structures",
  "Reads simple sentences fluently",
  "Comprehends short stories",
  "Writes simple sentences",
  "Uses punctuation correctly",
  "Demonstrates active listening",
  "Expresses ideas verbally"
];

const DEFAULT_NUMERACY = [
  "Counts 1-50 correctly",
  "Identifies numbers up to 100",
  "Understands more/less concepts",
  "Simple addition within 10",
  "Simple subtraction within 10",
  "Identifies basic 2D shapes",
  "Understands place value (Tens/Ones)",
  "Continues simple patterns",
  "Tells time to the hour",
  "Measures length using non-standard units"
];

export function useFLNConfigStore() {
  const [config, setConfig] = useState<FLNConfig>({
    categories: {
      FOUNDATION: [...DEFAULT_MILESTONES],
      LITERACY: [...DEFAULT_MILESTONES],
      NUMERICY: [...DEFAULT_NUMERACY]
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_fln_config_v1');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const updateMilestone = useCallback((category: FLNCategory, index: number, value: string) => {
    setConfig(prev => {
      const updatedCategory = [...prev.categories[category]];
      updatedCategory[index] = value;
      const newConfig = {
        ...prev,
        categories: {
          ...prev.categories,
          [category]: updatedCategory
        }
      };
      localStorage.setItem('edupulse_fln_config_v1', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, updateMilestone, isLoaded };
}
