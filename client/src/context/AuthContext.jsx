/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import axios from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, username) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        username,
      });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
