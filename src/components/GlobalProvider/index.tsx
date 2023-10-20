import { GlobalContext } from '@hook/globalState';
import { getInitialState, getUserInfo } from '@config/initialState';
import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useState } from 'react';

const GlobalProvider = ({ children }: PropsWithChildren<any>) => {
  const [state, setState] = useState<any>();
  useLayoutEffect(() => {
    getInitialState().then((res) => setState(res));
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        initialState: state,
        // 清除用户信息
        clearUserInfo: () => {
          if (!state.currentUser) {
            return;
          }
          setState({ ...state, currentUser: undefined });
        },
        getUserInfo,
        setInitialState: setState,
        // 拉取用户信息
        getCurrentUser: async () => {
          const res = await getUserInfo();
          setState({ ...state, currentUser: res });
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
