import { useContext, useReducer, Dispatch, createContext } from 'react';
import { Action, AppState, appReducer } from './store';

const AppStateContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    chatList: [],
    currentUser: { id: '', username: '' }
  });

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
