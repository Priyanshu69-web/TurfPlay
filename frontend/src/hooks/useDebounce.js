import { useState, useEffect } from 'react';

/**
 * Debounces a value by a given delay (ms).
 * Usage: const debouncedSearch = useDebounce(searchTerm, 400);
 */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
