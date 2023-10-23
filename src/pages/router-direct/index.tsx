import { ROUTERDIRECT } from '@common/constant';
import routes from '@routes/index';
import { history, useAccess, useLocation } from '@umijs/max';
import type React from 'react';

/**
 * 可以用在每个菜单下的大路由下作为权限跳板，而不是写死固定的redirect
 * 默认会跳转到第一个有权限的路由
 * ex:
 * export default [
 *   {
 *    path: '/xxx',
      name: 'xxx',
      authority: 'xxx',
      routes: [
        {
          path: '.',
          redirect: ROUTERDIRECT,
        },
        {
          path: ROUTERDIRECT,
          name: ROUTERDIRECT,
          hideInMenu: true,
          component: () => import('@pages/router-direct'),
        },
        ...其他的路由部分
      ]
 *   }
 * ]
 * @returns 
 */
const RouterDirect: React.FC<any> = () => {
  const access = useAccess();
  const location = useLocation();

  const getAuthPathName = (pathArray: any[], routePath: string = '') => {
    let routeCopy = routePath;
    // debugger
    if (Array.isArray(pathArray) && pathArray.length) {
      for (let i = 0; i < pathArray.length; i++) {
        if (!pathArray[i]?.redirect && !pathArray[i].path?.endsWith(ROUTERDIRECT)) {
          if (pathArray[i]?.authority) {
            if (access?.normalRouteFilter(pathArray[i].authority)) {
              if (pathArray[i]?.children && pathArray[i]?.children?.length) {
                routeCopy = getAuthPathName(pathArray[i].children, routeCopy);
              } else {
                routeCopy += pathArray[i].path;
              }
              break;
            }
          } else {
            routeCopy += pathArray[i].path;
            if (!pathArray[i]?.children || !pathArray[i]?.children?.length) {
              break;
            }
          }
        }
      }
    }
    return routeCopy;
  };

  const currentRoute = routes
    .map((item: any) => {
      if (location.pathname.startsWith(item.path) && item.path !== '/') {
        return item;
      }
      return null;
    })
    .filter((ite) => ite);

  const currentAuthPath = getAuthPathName(currentRoute, '');

  if (Array.isArray(currentRoute) && currentRoute.length) {
    // 当所有路由都没权限，默认跳到welcome先
    if (currentAuthPath) {
      history.push(currentAuthPath);
    } else {
      history.push('/');
    }
  }

  return <></>;
};

export default RouterDirect;
