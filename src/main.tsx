import ReactDOM from 'react-dom/client';
import { useLayoutEffect } from 'react';
import { ConfigProviderWrap } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import AccessProvider from '@components/AccessProvider';
import GlobalProvider from '@components/GlobalProvider';
import zhCN from 'antd/es/locale/zh_CN';

import 'moment/locale/zh-cn';

import App from './App';

import './index.less';

// import 'antd/dist/antd.less'

moment.locale('en');

const Main = () => {
  useLayoutEffect(() => {
    // * 清除 html loading
    document.getElementById('page_loading_continer_html')?.remove();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <ConfigProviderWrap>
        <GlobalProvider>
          <AccessProvider>
            <App />
          </AccessProvider>
        </GlobalProvider>
      </ConfigProviderWrap>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />);
