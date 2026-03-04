import { useState, useEffect } from 'react';
import { databaseService } from '../services/database';

export const useIndexedDB = () => {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        // Wait for database to be ready
        await databaseService.getAllDocuments();
        setDbReady(true);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err.message);
      }
    };

    initDB();
  }, []);

  return {
    db: databaseService,
    dbReady,
    error
  };
};