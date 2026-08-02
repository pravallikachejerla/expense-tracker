import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useCategories from '../useCategories';
import api from '../../services/api';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../constants';

// Mock
jest.mock('../../services/api');
jest.mock('../../constants', () => ({
  CATEGORIES: ['Food', 'Housing', 'Utilities', 'Other']
}));

describe('useCategories Hook (New hook for standardized categories with fallback)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: ['Food', 'Travel', 'Bills'] });
  });

  test('fetches categories from API and updates state', async () => {
    const { result } = renderHook(() => useCategories());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual(['Food', 'Travel', 'Bills']);
      expect(result.current.error).toBeNull();
    });
    
    expect(api.get).toHaveBeenCalledWith('/expenses/categories');
  });

  test('falls back to defaults on API error (new standardized categories feature)', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useCategories());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual(DEFAULT_CATEGORIES);
      expect(result.current.error).toBeDefined();
    });
  });
});
