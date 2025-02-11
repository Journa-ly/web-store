// useLocalStorageSWR.ts
import { useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { localStorageProvider } from '../utils/localStorage';

function useLocalStorageSWR<T>(
  key: string,
  fetcher: (url: string) => Promise<T>,
  config?: SWRConfiguration<T, any>
) {
  // Memoize the cache instance so it isn't recreated on every render.
  const cache = useMemo(() => localStorageProvider(), []);

  return useSWR<T>(key, fetcher, {
    ...config,
    // The provider function must accept the default cache parameter.
    provider: (_defaultCache) => cache
  });
}

export default useLocalStorageSWR;
