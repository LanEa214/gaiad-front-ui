import defaultSettings from '@config/defaultSettings';
import { getCurrentUser, getVerifyConfig } from '@service/common';
import { message } from 'antd';
import favicon from '@assets/image/favicon.png';
import { history } from '@utils/umi';
import { isInWhiteList } from '@utils/utils';

async function initTenantInfo() {
  const { data } = await getVerifyConfig();
  if (!data) {
    message.error('获取系统配置失败');
    return;
  }
  const tenantDetail = data?.uiConfig || {};
  const { featureConfig } = data;
  const { urlConfig } = data;
  const { extraConfig } = data;

  const defaultTenantDetail: any = defaultSettings.tenantInfo;
  const tenantInfo: any = {};
  Object.keys(defaultTenantDetail).forEach((item) => {
    tenantInfo[item] = tenantDetail?.[item] || defaultSettings?.tenantInfo[item];
  });

  defaultSettings.title = tenantDetail.appName || defaultSettings.title;
  defaultSettings.tenantInfo = tenantInfo;
  defaultSettings.featureConfig = featureConfig;
  defaultSettings.enableCustomTheme = featureConfig?.enableCustomTheme;
  defaultSettings.urlConfig = urlConfig;
  defaultSettings.extraConfig = extraConfig;

  defaultSettings.key = data?.key;
  // defaultSettings.x = 1;
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  const href = tenantDetail.appFavIcon || favicon;
  link.href = href;
  document.getElementsByTagName('head')[0].appendChild(link);
  // 将ico配置到缓存内，提供给doc，解决私有化ico不一致的问题
  window.localStorage.setItem(
    'frontConfig',
    JSON.stringify({
      icoUrl: href,
    }),
  );
}

/**
 * 页面初始化执行
 */
export async function getInitialState(): Promise<{
  settings?: typeof defaultSettings;
  currentUser?: any;
}> {
  await initTenantInfo();
  const { pathname } = history.location;
  if (!isInWhiteList(pathname)) {
    const currentUser = await getCurrentUser();
    return {
      settings: defaultSettings,
      currentUser,
    };
  }
  return {
    settings: defaultSettings,
  };
}
