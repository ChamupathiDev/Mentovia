// src/hooks/useAuth.js
// Simplified: read token and role directly from localStorage
export function useAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { token, role };
}