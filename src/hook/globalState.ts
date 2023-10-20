// 全局状态
import type { IInitialState } from '@config/initialState';
import React, { useContext } from 'react';

export type IGlobalState = {
  initialState: IInitialState;
  clearUserInfo: () => void;
  getCurrentUser: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  setInitialState: React.Dispatch<any>;
};

export const GlobalContext = React.createContext<IGlobalState | null>(null);

export default function useGlobalState(modelName?: string): IGlobalState {
  /** @name 兼容umi带参数的 */
  console.log(`useGlobalState: ${modelName}`);
  const global = useContext(GlobalContext) as IGlobalState;
  return global;
}
