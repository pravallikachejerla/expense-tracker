import { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORIES as DEFAULT_CATEGORIES, API_BASE } from '../constants';

const useCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/expenses/categories`);
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
