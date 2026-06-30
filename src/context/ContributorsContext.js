import React, { createContext, useState, useEffect, useContext } from 'react';
import { getContributors } from '../services/githubService';

export const ContributorsContext = createContext(null);

export const ContributorsProvider = ({ children }) => {
    const [contributors, setContributors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContributors = async () => {
            setIsLoading(true);
            try {
                // نستخدم الواجهة الخلفية لجلب البيانات باستخدام GitHub App
                const data = await getContributors();
                setContributors(data);
            } catch (err) {
                setError(err.message || "فشل جلب البيانات");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributors();
    }, []);

    const value = {
        contributors,
        isLoading,
        error
    };

    return (
        <ContributorsContext.Provider value={value}>
            {children}
    </ContributorsContext.Provider>
  );
};

export const useGitHubContributors = () => {
    const context = useContext(ContributorsContext);
    
    if (!context) {
        throw new Error('useGitHubContributors must be used within a ContributorsProvider');
    }

    return context;
};
