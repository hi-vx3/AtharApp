import React from 'react';
import { AuthProvider } from './AuthContext';
import { GitHubAuthProvider } from './GitHubAuthContext';
import { GitHubRepoProvider } from './GitHubRepoContext';
import { ContributorsProvider } from './ContributorsContext';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <GitHubAuthProvider>
        <GitHubRepoProvider>
          <ContributorsProvider>
            {children}
          </ContributorsProvider>
        </GitHubRepoProvider>
      </GitHubAuthProvider>
    </AuthProvider>
  );
};
