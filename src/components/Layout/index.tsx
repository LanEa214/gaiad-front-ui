import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import React, { Suspense, useMemo } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PageLoading } from '@ant-design/pro-components';

import routesConfig from '@/routes';

import defaulSetting from '@config/defaultSettings';
import ExceptionContainer from '@components/ExceptionContainer';
import { useAccessMarkedRoutes } from '@hook/useAccessMarkedRoutes';
import withFadeAnimation from '@/be-common/src/components/AnimationContainer';
import ChunksErrorBoundary from './ChunksErrorBoundary';
import { history } from '@utils/umi';
import { routeRedirect } from '@utils/utils';
import { getUrlParams } from '@/be-common/src/utils';

/**
 * 处理路由数据 => Routes，将数据处理成对应的`Route`，但不是跟数据一样嵌套的，这边节点是打平的，
 * 如果需要嵌套路由，请在组件内添加 Route
 * @param routeData {MenuDataItem} 路由数据
 * @param cacheRoutes {any} Route数组
 * @returns
 */
function generateRoute(routeData: MenuDataItem[], cacheRoutes: any[] = []) {
  const loop = (route: MenuDataItem, parentRoute?: MenuDataItem) => {
    const { component: getComponent, redirect, children, isNestRoutes } = route;
    if (Array.isArray(children) && children.length > 0) {
      // 有子集渲染子集Route，自己不渲染Route
      children.forEach((rs: MenuDataItem) => loop(rs, route));
    } else if (redirect) {
      // 渲染redirect Route
      cacheRoutes.push(
        <Route
          key={`redirect-${redirect}`}
          path={parentRoute?.path || '/'}
          element={<Navigate replace to={redirect} />}
        />,
      );
    } else {
      // 添加动画
      const Component = withFadeAnimation(getComponent && React.lazy(() => getComponent()));
      // 渲染正常的Route
      cacheRoutes.push(
        <Route
          key={`route-${route.path}`}
          // 兼容ProLayout 菜单active匹配与router@v6 nest routes
          path={route.path + (isNestRoutes ? '/*' : '')}
          element={<ExceptionContainer element={<Component />} />}
        />,
      );
    }
  };
  routeData.map((rt) => loop(rt));
  return cacheRoutes;
}

const getRedirectList = (routeArray: any[]) => {
  if (Array.isArray(routeArray) && routeArray?.length) {
    return routeArray.reduce((acc: any, cur: any) => {
      if (cur?.routeRedirect) {
        acc.push(cur);
      }
      if (Array.isArray(cur?.children) && cur?.children?.length) {
        acc.push(getRedirectList(cur?.children));
      }
      return acc;
    }, []);
  }
  return [];
};

const App = function App() {
  const location = useLocation();
  const nestedRoutes = useMemo(() => generateRoute(routesConfig), []);
  // 是否自定义生成redirect，开启之后默认寻找第一个当前大菜单下第一个有权限的菜单
  const showRedirect = true;
  // () => true 为自定义过滤函数部分，例如：(route: any) => access?.normalRouteFilter(route)
  const realRoutes = routeRedirect(useAccessMarkedRoutes(routesConfig), () => true);

  const routeList = getRedirectList(realRoutes).flat(+Infinity);
  const urlParams = getUrlParams();

  return (
    <ProLayout
      route={{ routes: realRoutes }}
      location={location}
      headerHeight={urlParams.get('header') ? 0 : 72}
      siderWidth={urlParams.get('sider') ? 0 : 208}
      logo={null}
      collapsedButtonRender={false}
      {...defaulSetting}
      // rightContentRender={() => {
      //   return <RightContent />;
      // }}
      breadcrumbProps={{
        separator: '>',
        itemRender: (route: any) => {
          if (showRedirect) {
            return (
              <Link
                to={
                  routeList?.find((item: any) => item.path === route.path)?.routeRedirect ||
                  route.path
                }
              >
                {route.breadcrumbName}
              </Link>
            );
          }
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
      breadcrumbRender={(routers = []) => {
        if (urlParams.get('breadcrumb')) {
          return [];
        }
        return [...routers];
      }}
      menuItemRender={(item: any, dom: any) => {
        if (showRedirect) {
          return (
            <a
              onClick={() => {
                if (item?.routeRedirect) {
                  history.push(item?.routeRedirect || '/welcome');
                } else {
                  history.push(item.path || '/welcome');
                }
              }}
            >
              {dom}
            </a>
          );
        }
        return <Link to={item.path}>{dom}</Link>;
      }}
      ErrorBoundary={ChunksErrorBoundary}
    >
      <Suspense fallback={<PageLoading />}>
        <Routes>{nestedRoutes}</Routes>
      </Suspense>
    </ProLayout>
  );
};

export default App;
