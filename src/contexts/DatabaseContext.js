import React, { createContext, useContext } from 'react';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ value, children }) => {
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};