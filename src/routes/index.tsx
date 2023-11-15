import type { MenuDataItem } from '@ant-design/pro-components';

import routes from './routes';
import { createElement } from 'react';

import * as IconMap from '@ant-design/icons';

/**
 *
 * @param base {String} 基本url，父级url
 * @param url {String} 当前的要处理或者判断的`url`
 * @returns {String}
 */
function relativeToAbsoutePath(base: string, url?: string): string {
  // 绝对 or 空 直接返回
  if (!url || url.startsWith('/')) return url || '';
  // 相对，但是base后缀有 '/'
  if (base.endsWith('/')) return base + url;
  // 相对 无 ‘/’
  return base + '/' + url;
}

function handleRoutes(routeData: MenuDataItem[], paranentRoute?: MenuDataItem): MenuDataItem[] {
  if (!routeData) return [];
  const position = paranentRoute?.position || [];
  return routeData.map((route: MenuDataItem) => {
    const { path, name, icon, ...rest } = route;
    const realPath: string = relativeToAbsoutePath(paranentRoute?.path || '/', path);
    const currentPosition = position.concat([{ path: realPath, breadcrumbName: name }]);
    const NewIcon = (IconMap as any)[icon as string];

    const newRouteData = {
      ...rest,
      path: realPath,
      name,
      icon: NewIcon ? createElement(NewIcon) : icon,
      position: currentPosition,
      children: handleRoutes(rest?.routes || rest?.children, {
        position: currentPosition,
        path: realPath,
      }),
    };
    return newRouteData;
  });
}

const newRoutes = handleRoutes(routes);

export default newRoutes;
