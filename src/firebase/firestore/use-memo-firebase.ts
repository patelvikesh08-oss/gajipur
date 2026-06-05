
'use client';

import { useMemo, useRef } from 'react';

/**
 * A specialized version of useMemo that ensures Firestore references/queries 
 * are stable across renders. This prevents infinite loops in hooks like useCollection.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}
