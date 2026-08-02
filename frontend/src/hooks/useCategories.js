import { useState, useEffect } from 'react';
import api from '../services/api';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../constants';

/**
 * Custom hook for categories (now uses centralized api service).
 * Falls back to defaults on error. Improves consistency with other hooks.
 * Preserves exact original behavior.
 */
const useCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/expenses/categories');  // or budget/categories
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories, using defaults');
        setError(err.message);
        // fallback already set in state
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
