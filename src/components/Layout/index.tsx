import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import React, { Suspense, useMemo } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PageLoading } from '@ant-design/pro-components';

import routesConfig from '@/routes';

import defaulSetting from '@config/defaultSettings';
import ExceptionContainer from '@components/ExceptionContainer';
import { useAccessMarkedRoutes } from '@hook/useAccessMarkedRoutes';
import withFadeAnimation from '@components/AnimationContainer';

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

const App = function App() {
  const location = useLocation();
  const nestedRoutes = useMemo(() => generateRoute(routesConfig), []);
  const realRoutes = useAccessMarkedRoutes(routesConfig);
  return (
    <ProLayout
      route={{ routes: realRoutes }}
      location={location}
      logo={null}
      collapsedButtonRender={false}
      {...defaulSetting}
      // rightContentRender={() => {
      //   return <RightContent />;
      // }}
      breadcrumbProps={{
        separator: '>',
        itemRender: (route: any) => <Link to={route.path}>{route.breadcrumbName}</Link>,
      }}
      breadcrumbRender={(routers = []) => [...routers]}
      menuItemRender={(item: any, dom: any) => <Link to={item.path}>{dom}</Link>}
    >
      <Suspense fallback={<PageLoading />}>
        <Routes>{nestedRoutes}</Routes>
      </Suspense>
    </ProLayout>
  );
};

export default App;
