// 全局状态
import type { IInitialState } from '@config/initialState';
import React, { useContext } from 'react';

export type IGlobalState = {
  initialState: IInitialState;
  clearUserInfo: () => void;
  getCurrentUser: () => Promise<void>;
};

export const GlobalContext = React.createContext<IGlobalState | null>(null);

export default function useGlobalState(): IGlobalState {
  const global = useContext(GlobalContext) as IGlobalState;
  return global;
}
