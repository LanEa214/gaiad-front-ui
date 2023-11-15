import type { ProLayoutProps } from '@ant-design/pro-components';
import { DEFAULT_TENANT_INFO } from './tenantInfo';

const { VITE_PUBLIC_RES_PATH, VITE_PUBLIC_API_PATH } = import.meta.env;

export { VITE_PUBLIC_RES_PATH, VITE_PUBLIC_API_PATH };

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  // tenantInfo?: TenantInfo;
  endpoint?: any;
  extraInfo?: any;
  enableCustomTheme?: any;
  featureConfig?: any;
  urlConfig?: any;
  extraConfig?: any;
  uiConfig?: any;
  apiPrefix: string;
  key?: string;
  tenantInfo: Record<string, any>;
} = {
  navTheme: 'light',
  // 拂晓蓝
  contentWidth: 'Fluid',
  colorWeak: false,
  fixedHeader: false,
  fixSiderbar: true,
  splitMenus: true,
  siderWidth: 208,
  layout: 'mix',
  title: 'GAIA',
  collapsed: false,
  // logo: '',
  iconfontUrl: `${PUBLIC_RESOURCE_STATIC_PATH}iconfont/iconfont.js`,
  tenantInfo: DEFAULT_TENANT_INFO,
  enableCustomTheme: true,
  apiPrefix: VITE_PUBLIC_API_PATH,
  endpoint: {},
  extraInfo: {},
};

export default Settings;
