import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchUsuario } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('tp_token');
    if (token) {
      fetchUsuario().then(remoteUser => {
        if (remoteUser && remoteUser.nome) {
          setUser(remoteUser);
          localStorage.setItem('tp_user', JSON.stringify(remoteUser));
        }
      }).catch(() => {});
    }
  }, []);

  async function login(identifier, password) {
    const res = await loginUser(identifier, password);
    if (res.token) {
      localStorage.setItem('tp_token', res.token);
    }
    if (res.usuario) {
      setUser(res.usuario);
      localStorage.setItem('tp_user', JSON.stringify(res.usuario));
    }
    return res;
  }

  async function register(nome, email, password, school) {
    const res = await registerUser(nome, email, password, school);
    if (res.token) {
      localStorage.setItem('tp_token', res.token);
    }
    if (res.usuario) {
      setUser(res.usuario);
      localStorage.setItem('tp_user', JSON.stringify(res.usuario));
    }
    return res;
  }

  function logout() {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    setUser(null);
  }

  function updateUser(newData) {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('tp_user', JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      updateUser: () => {},
    };
  }
  return context;
}

