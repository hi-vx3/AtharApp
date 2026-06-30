import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { checkAuthStatus as apiCheckAuthStatus, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

/**
 * مزود حالة المصادقة، يوفر بيانات المستخدم وحالة تسجيل الدخول للتطبيق بأكمله.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // للتعامل مع التحقق الأولي

  // التأكد من حالة تسجيل الدخول عند تحميل الصفحة لأول مرة
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const data = await apiCheckAuthStatus();
        if (data.isAuthenticated) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // تجاهل الخطأ، يعني أن المستخدم غير مسجل دخوله
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // دالة تسجيل الخروج
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("فشل في تسجيل الخروج من الخادم:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    logout,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

/**
 * Hook مخصص للوصول بسهولة إلى سياق المصادقة.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  // التحقق من أن الـ Hook يُستخدم ضمن مزود الحالة
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped in AuthProvider.');
  }
  return context;
};