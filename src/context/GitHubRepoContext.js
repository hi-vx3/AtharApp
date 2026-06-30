import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from './apiClient';
import { useAuth } from './AuthContext';

export const GitHubRepoContext = createContext(null);

export const GitHubRepoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [isJoining, setIsJoining] = useState(false);
  const [isContributor, setIsContributor] = useState(false);
  const [openRepoFailed, setOpenRepoFailed] = useState(false);
  const [repoUrl, setRepoUrl] = useState(null);
  const [joinStatus, setJoinStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await apiClient('/github/check-collaborator');
        if (isMounted) {
          if (response.repoUrl) {
            setRepoUrl(response.repoUrl);
          }
          if (response.isCollaborator) {
            setIsContributor(true);
          }
        }
      } catch (error) {}
    };
    checkStatus();

    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const requestJoin = async () => {
    if (isJoining || isContributor) return;
    setIsJoining(true);
    setJoinStatus(null);
    
    try {
      const response = await apiClient('/github/join', { method: 'POST' });
      setIsContributor(true);
      if (response.repoUrl) {
        setRepoUrl(response.repoUrl);
      }

      if (response.status === 'invited') {
        setJoinStatus({ type: 'success', message: 'تم إرسال دعوة الانضمام إلى بريدك الإلكتروني المرتبط بحساب GitHub! يرجى قبولها لتتمكن من المساهمة.' });
      } else if (response.status === 'collaborator') {
        setJoinStatus({ type: 'info', message: 'أنت بالفعل مساهم في هذا المستودع!' });
      }
    } catch (error) {
      console.error("فشل إرسال طلب الانضمام:", error);
      setJoinStatus({ type: 'error', message: 'فشل إرسال طلب الانضمام. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsJoining(false);
    }
  };

  const openRepo = () => {
    if (!repoUrl) {
      console.error("لا يمكن فتح المستودع: الرابط غير متوفر من الخادم.");
      return;
    }

    setOpenRepoFailed(false);

    const onBlur = () => {
      clearTimeout(timer);
      window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);

    const timer = setTimeout(() => {
      setOpenRepoFailed(true);
      window.removeEventListener('blur', onBlur);
    }, 1500);

    window.location.href = `x-ss-client://openRepo/${repoUrl}`;
  };

  const value = {
    isJoining,
    isContributor,
    openRepoFailed,
    joinStatus,
    requestJoin,
    openRepo
  };

  return (
    <GitHubRepoContext.Provider value={value}>
      {children}
    </GitHubRepoContext.Provider>
  );
};

export const useGitHubRepo = () => {
  const context = useContext(GitHubRepoContext);
  if (!context) {
    throw new Error('useGitHubRepo must be used within a GitHubRepoProvider');
  }
  return context;
};
