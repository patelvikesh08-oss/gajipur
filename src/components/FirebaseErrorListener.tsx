'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { toast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Contextual Firestore Error:', error);
      
      toast({
        variant: 'destructive',
        title: 'Permission Denied / પરવાનગી નકારી',
        description: `You do not have permission to ${error.context.operation} at ${error.context.path}. Please check security rules.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
