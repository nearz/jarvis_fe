import { useCallback, useState, useRef, useEffect } from "react";

interface UseAsyncServiceOptions<TResult> {
  /** Callback fired when the async operation succeeds */
  onSuccess?: (result: TResult) => void;
  /** Callback fired when the async operation throws an error */
  onError?: (error: Error) => void;
}

interface UseAsyncServiceReturn<TArgs, TResult> {
  /** Execute the async function with the provided arguments */
  execute: (args: TArgs) => Promise<TResult | undefined>;
  /** Whether the async operation is currently in progress */
  loading: boolean;
  /** The error from the last failed operation, or null if none */
  error: Error | null;
  /** Clear the error state */
  reset: () => void;
}

/**
 * Hook to manage async operations with loading and error states.
 *
 * Features:
 * - Automatic loading state management
 * - Error capture and state management
 * - Unmount safety (prevents state updates on unmounted components)
 * - Stable `execute` function reference (safe for dependency arrays)
 * - Optional success/error callbacks
 *
 * @example
 * ```tsx
 * // Basic usage
 * function LoginForm({ onLogin }) {
 *   const { execute: login, loading, error } = useAsyncService(authService.login);
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const result = await login({ email, password });
 *     if (!result) return; // Unmounted or error
 *     if (result.success) {
 *       onLogin(true);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <Text color="red">{error.message}</Text>}
 *       <Button loading={loading} type="submit">Login</Button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { execute: deleteItem } = useAsyncService(itemService.delete, {
 *   onSuccess: () => toast.success("Item deleted!"),
 *   onError: (err) => toast.error(err.message),
 * });
 * ```
 *
 * @param asyncFn - The async function to wrap (e.g., an API service method)
 * @param options - Optional callbacks for success and error handling
 * @returns Object containing execute function, loading state, error state, and reset function
 */
export function useAsyncService<TArgs, TResult>(
  asyncFn: (args: TArgs) => Promise<TResult>,
  options?: UseAsyncServiceOptions<TResult>,
): UseAsyncServiceReturn<TArgs, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);

  // Store callbacks in refs to keep execute stable while allowing callback updates
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  onSuccessRef.current = options?.onSuccess;
  onErrorRef.current = options?.onError;

  // Mark as unmounted on cleanup to prevent state updates
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Execute the async function with loading/error state management.
   * Returns undefined if component unmounts during execution or if an error occurs.
   */
  const execute = useCallback(
    async (args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(args);
        if (!mountedRef.current) return undefined;
        onSuccessRef.current?.(result);
        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          onErrorRef.current?.(err as Error);
        }
        return undefined;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [asyncFn],
  );

  /**
   * Clear the error state.
   * Useful when you want to dismiss an error message or retry an operation.
   */
  const reset = useCallback(() => setError(null), []);

  return { execute, loading, error, reset };
}
