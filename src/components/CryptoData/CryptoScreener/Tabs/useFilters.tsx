import { useState, useEffect } from 'react';
// import api from 'src/api';

interface Filters {
  [key: string]: any;
}

const useFilters = (url: string) => {
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFilters(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [url]);

  return { filters, loading, error };
};

export default useFilters;