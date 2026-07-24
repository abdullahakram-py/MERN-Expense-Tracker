import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext({
    refreshKey: 0,
    requestRefresh: () => {}
});

export const RefreshProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const requestRefresh = () => setRefreshKey(k => k + 1);
    return (
        <RefreshContext.Provider value={{ refreshKey, requestRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
