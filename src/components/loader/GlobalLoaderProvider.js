import React, {createContext, useContext, useState} from 'react';
import GlobalLoader from './GlobalLoader';

const GlobalLoaderContext = createContext();

export const GlobalLoaderProvider = ({children}) => {
  const [isLoading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <GlobalLoaderContext.Provider value={{showLoader, hideLoader}}>
      {children}
      <GlobalLoader visible={isLoading} />
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      'useGlobalLoader must be used within a GlobalLoaderProvider',
    );
  }
  return context;
};
