import React from 'react';

export type LoaderContextType = {
  isLoading: boolean;
};

export const LoaderContext = React.createContext<LoaderContextType>({
  isLoading: false,
});
