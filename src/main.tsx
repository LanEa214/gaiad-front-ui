import ReactDOM from 'react-dom/client';
import { ConfigProviderWrap, PageLoading } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import { useLayoutEffect, useState } from 'react';
import moment from 'moment';

import { CustomHashRouter } from '@utils/customRouter';
import { GlobalContext } from '@hook/globalState';
import Layout from '@components/Layout';
import { getInitialState, getUserInfo } from '@config/initialState';
import zhCN from 'antd/es/locale/zh_CN';

import 'moment/locale/zh-cn';

import './index.less';

moment.locale('en');

const Main = () => {
  const [state, setState] = useState<any>();
  useLayoutEffect(() => {
    getInitialState().then((res) => setState(res));
  }, []);
  return (
    <ConfigProvider locale={zhCN}>
      <ConfigProviderWrap>
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
            // 拉取用户信息
            getCurrentUser: async () => {
              const res = await getUserInfo();
              setState({ ...state, currentUser: res });
            },
          }}
        >
          <CustomHashRouter>{state ? <Layout /> : <PageLoading />}</CustomHashRouter>
        </GlobalContext.Provider>
      </ConfigProviderWrap>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />);
