import React, { createContext, useState, useCallback, useEffect, useRef, useContext } from 'react';
import { apiClient } from './apiClient';
import { useAuth } from './AuthContext';
import { openCenteredPopup } from '../utils/popupManager';
import ENV from '../config/env';

export const GitHubAuthContext = createContext(null);

const AUTH_ERROR_MAP = {
  'AUTH_CODE_NOT_PROVIDED': 'لم يتم توفير رمز التفويض من GitHub.',
  'GITHUB_TOKEN_EXCHANGE_FAILED': 'فشل في تبادل الرمز مع GitHub.',
  'GITHUB_FETCH_USER_FAILED': 'فشل في جلب بيانات المستخدم من GitHub.',
  'CSRF_VIOLATION': 'فشل التحقق من State، قد تكون هناك محاولة CSRF.',
  'INTERNAL_SERVER_ERROR': 'حدث خطأ داخلي في الخادم.',
  'GITHUB_AUTH_FAILURE': 'فشلت عملية المصادقة مع GitHub.',
  'No code received': 'لم يتم استلام رمز المصادقة.'
};

const translateAuthError = (key, message) => {
  if (key === 'GITHUB_TOKEN_EXCHANGE_FAILED' && message) {
    return `${AUTH_ERROR_MAP[key]}: ${message}`;
  }
  return AUTH_ERROR_MAP[key] || message || 'حدث خطأ غير معروف.';
};

// --- CSRF Utils ---
const generateState = () => {
  const state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('github_oauth_state', state);
  return state;
};

const validateState = (receivedState) => {
  const storedState = sessionStorage.getItem('github_oauth_state');
  sessionStorage.removeItem('github_oauth_state'); // Clean up immediately
  
  if (!receivedState || receivedState !== storedState) {
    throw new Error(translateAuthError('CSRF_VIOLATION', 'State mismatch. Possible CSRF attack.'));
  }
};

export const GitHubAuthProvider = ({ children }) => {
  const authContext = useAuth();

  const { isAuthenticated, setUser, setIsAuthenticated, isLoading } = authContext;

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  
  const popupRef = useRef(null);
  const isProcessingRef = useRef(false);

  const closePopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
  }, []);

  const login = useCallback(() => {
    if (isLoggingIn || isAuthenticated || isLoading) return;

    setIsLoggingIn(true);
    setError(null);

    const state = generateState();
    
    const url = 'https://github.com/login/oauth/authorize';
    const clientId = ENV.GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'read:user user:email';
    const popup = { width: 600, height: 700, title: 'GitHub Login' };

    const fullUrl = `${url}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    popupRef.current = openCenteredPopup(fullUrl, popup.title, popup.width, popup.height);
  }, [isLoggingIn, isAuthenticated, isLoading]);

  const processAuthCode = useCallback(async (authCode, receivedState) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      validateState(receivedState);

      const data = await apiClient('/auth/github', {
        method: 'POST', 
        body: { code: authCode }
      });

      setUser(data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('GitHub Auth API Error:', err.data || err);
      setError(translateAuthError(err.data?.errorKey, err.message));
    } finally {
      closePopup();
      setIsLoggingIn(false);
      isProcessingRef.current = false;
    }
  }, [setUser, setIsAuthenticated, closePopup]);

  // Auth message listener and popup lifecycle manager
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, code, state, error: authError, errorDescription } = event.data || {};

      if (type === 'GITHUB_AUTH_SUCCESS' && code && state) {
        processAuthCode(code, state);
      } else if (type === 'GITHUB_AUTH_FAILURE') {
        console.error('GitHub Auth Error:', authError, errorDescription);
        setError(translateAuthError('GITHUB_AUTH_FAILURE', errorDescription || authError));
        sessionStorage.removeItem('github_oauth_state');
        closePopup();
        setIsLoggingIn(false);
      }
    };
    
    window.addEventListener('message', handleAuthMessage);

    const popupMonitor = setInterval(() => {
      if (isLoggingIn && popupRef.current?.closed) {
        sessionStorage.removeItem('github_oauth_state');
        setIsLoggingIn(false); 
        clearInterval(popupMonitor);
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
      clearInterval(popupMonitor);
    };
  }, [isLoggingIn, processAuthCode, closePopup]);

  const value = { isLoggingIn, error, login };

  return (
    <GitHubAuthContext.Provider value={value}>
      {children}
    </GitHubAuthContext.Provider>
  );
};

export const useGitHubAuth = () => {
  const context = useContext(GitHubAuthContext);
  if (!context) {
    throw new Error('useGitHubAuth must be used within a GitHubAuthProvider');
  }
  return context;
};
