import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseLoadingState {
  isLoading: boolean;
  error: Error | null;
  execute: <T,>(fn: () => Promise<T>) => Promise<T | null>;
}

export const useLoading = (): UseLoadingState => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fn();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    execute,
  };
};
