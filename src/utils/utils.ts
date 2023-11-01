import { removeSystemToken } from '@/be-common/src/utils';
import { THEME_LIST } from '@common/constant';
import { Base64 } from 'js-base64';
// import defaultSettings from '@config/defaultSettings'

export const getThemeName = () => {
  const themeName = localStorage.getItem('curTheme') || THEME_LIST.light.name;
  return themeName;
};

/**
 * 不需要登录的白名单函数，因为有些不仅仅是固定的path，还有些是一定的规律不登录
 * @param pathname
 * @returns
 */
export const isInWhiteList = (pathname: string) => {
  return ['/see/my/lic', '/auth/passport'].includes(pathname);
};

export const encodeBase64 = (str: any) => {
  return Base64.encode(str, true);
};

export const decodeBase64 = (str: any) => {
  return Base64.decode(str);
};

// 权限失效的动作，在这里修改
export const onTokenInvalid = (needClear = true) => {
  if (needClear) {
    removeSystemToken();
  }
  // and then go to login add your custom code here
};
