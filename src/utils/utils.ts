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

const getFirstAuthRoutePath: any = (route: any, judgeCallback: (param: any) => boolean) => {
  if (Array.isArray(route) && route.length) {
    for (let i = 0; i < route.length; i++) {
      // eslint-disable-next-line no-prototype-builtins
      if (!route[i]?.hasOwnProperty('redirect') && !route[i]?.name?.startsWith('ROUTERDIRECT')) {
        // 有权限码控的话
        if (route[i]?.authority) {
          if (judgeCallback(route[i])) {
            if (route[i]?.children?.length) {
              return getFirstAuthRoutePath(route[i]?.children, judgeCallback);
            } else {
              return route[i].path;
            }
          }
        } else {
          if (route[i]?.children?.length) {
            return getFirstAuthRoutePath(route[i]?.children, judgeCallback);
          } else {
            return route[i].path;
          }
        }
      }
    }
  } else {
    return route?.path || '/404';
  }
};

// 渲染菜单部分的路由
export const routeRedirect: any = (
  routeArray: any[],
  judgeCallback: (param: any) => boolean,
  parentRootPath?: string,
) => {
  if (Array.isArray(routeArray) && routeArray.length) {
    let hasRedirect = routeArray.some((route: any) => route?.redirect);
    return routeArray
      .reduce((acc: any, cur: any) => {
        // 面包屑是根据path的/来分割的，所以如果root跟子路由的path相同的话，面包屑会消失
        if (hasRedirect && cur?.redirect) {
          // 找到第一个有权限的子路由，动态添加
          cur.redirect = getFirstAuthRoutePath(routeArray, judgeCallback);
          acc.push(cur);
          return acc;
        } else if (!hasRedirect) {
          hasRedirect = true;
          // 此条路由是新加入的，需要继续往下走
          acc.push({
            path: parentRootPath ? `${parentRootPath}/.` : '.',
            redirect: getFirstAuthRoutePath(routeArray, judgeCallback),
          });
        }

        // 有子菜单的部分
        if (Array.isArray(cur?.children) && cur?.children?.length) {
          acc.push({
            ...cur,
            children: routeRedirect(cur?.children, judgeCallback, cur?.path),
            routes: routeRedirect(cur?.children, judgeCallback, cur?.path),
            // 解决menuItemRender跳转的问题
            routeRedirect: getFirstAuthRoutePath(cur?.children, judgeCallback),
          });
        } else {
          acc.push({
            ...cur,
            // 解决menuItemRender填补子菜单没有这个属性的问题
            routeRedirect: undefined,
          });
        }

        return acc;
      }, [])
      .filter((ite: any) => ite);
  } else {
    return [];
  }
};
