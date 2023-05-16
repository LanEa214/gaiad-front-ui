import { KEY_TOKEN, KEY_TOKEN_TYPE, THEME_LIST } from '@common/constant';
import { Base64 } from 'js-base64';
import Cookie from 'js-cookie';
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
  return ['/user/login', '/user/login/redirect', '/see/my/lic', '/auth/passport'].includes(
    pathname,
  );
};

export const encodeBase64 = (str: any) => {
  return Base64.encode(str, true);
};

export const decodeBase64 = (str: any) => {
  return Base64.decode(str);
};

export const getToken = (): string => {
  if (!Cookie.get(KEY_TOKEN)) return '';
  return `${Cookie.get(KEY_TOKEN_TYPE) || 'bearer'} ${Cookie.get(KEY_TOKEN)}`;
};

// 权限失效的动作，在这里修改
export const onTokenInvalid = (needClear = true) => {
  if (needClear) {
    Cookie.remove(KEY_TOKEN);
    Cookie.remove(KEY_TOKEN_TYPE);
  }
  // and then go to login add your custom code here
};

type IToken = {
  token: string;
  type: string;
};

export const setCookieToken = ({ token, type }: IToken) => {
  Cookie.set(KEY_TOKEN, token);
  Cookie.set(KEY_TOKEN_TYPE, type);
};
