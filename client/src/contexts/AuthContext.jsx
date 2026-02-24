import { useState, createContext, useContext, useEffect } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import { fetchLogout, fetchMe } from '../api/index.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        if (me && Object.keys(me).length > 0) {
          setLoggedIn(true);
          setUser(me);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (data) => {
    if (!data) return false;
    const accessToken = data.accessToken || data.token;
    if (!accessToken) return false;
    const userData = data.user || data;

    setLoggedIn(true);
    setUser(userData);
    localStorage.setItem('access-token', accessToken);
    if (data.refreshToken || data.refresh_token) {
      localStorage.setItem('refresh-token', data.refreshToken || data.refresh_token);
    }
    return true;
  };

  const logout = async () => {
    setLoggedIn(false);
    setUser(null);
    await fetchLogout();
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    );
  }

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };
