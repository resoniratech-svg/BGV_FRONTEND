// Utility functions for localStorage interactions
export const getFromStorage = <T = any>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setInStorage = <T = any>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
