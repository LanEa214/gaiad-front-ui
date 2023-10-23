// @ts-nocheck from umijs plugin access
import { useMemo } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import useAccess from './useAccess';

export type IRoute = MenuDataItem;

export const useAccessMarkedRoutes = (routes: IRoute[]) => {
  const access = useAccess();
  const markdedRoutes: IRoute[] = useMemo(() => {
    const process = (route: IRoute, parentAccessCode?: string, parentRoute?: IRoute) => {
      let accessCode = route.access;
      // 用父级的路由检测父级的 accessCode
      let detectorRoute = route;
      if (!accessCode) {
        // 脚手架新建，如果菜单权限只加了authority ，走默认的normalRouteFilter 方法校验
        if (route?.authority) {
          accessCode = 'normalRouteFilter';
        } else {
          accessCode = parentAccessCode;
          detectorRoute = parentRoute as IRoute;
        }
      }

      // set default status unaccessible 不可访问 true, 可访问 false proLayout自带处理
      route.unaccessible = false;

      // check access code
      if (typeof accessCode === 'string') {
        const detector = access[accessCode];

        if (typeof detector === 'function') {
          route.unaccessible = !detector(detectorRoute);
        } else if (typeof detector === 'boolean') {
          route.unaccessible = !detector;
        } else if (typeof detector === 'undefined') {
          route.unaccessible = true;
        }
      }

      // check children access code
      if (route.children?.length) {
        const isNoAccessibleChild = !route.children.reduce((hasAccessibleChild, child) => {
          process(child, accessCode, route);

          return hasAccessibleChild || !child.unaccessible;
        }, false);

        // make sure parent route is unaccessible if all children are unaccessible
        if (isNoAccessibleChild) {
          route.unaccessible = true;
        }
      }

      // check children access code
      if (route.routes?.length) {
        const isNoAccessibleChild = !route.routes.reduce((hasAccessibleChild, child) => {
          process(child, accessCode, route);

          return hasAccessibleChild || !child.unaccessible;
        }, false);

        // make sure parent route is unaccessible if all children are unaccessible
        if (isNoAccessibleChild) {
          route.unaccessible = true;
        }
      }

      return Object.assign({}, route);
    };

    return routes.map((route) => process(route));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.length, access]);

  return markdedRoutes;
};
