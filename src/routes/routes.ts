/**
 * 可采用相当路径 or 绝对路径，而且path 可以前缀不一致也可以放在一起
 *
 * 权限：
 *  可直接配置authority自动，不需要配置access字段，默认走acces.ts下的normalRouteFilter 方法
 *  如果是非标准的，可以再access下自定义方法，通过access字段指定方法名称
 */

export default [
  // ...sysRoutes,
  {
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: '首页',
    // 内部是否有nestRoutes
    isNestRoutes: true,
    // authority: '权限码'
    component: () => import('@pages/welcome'),
  },
  {
    name: '列表页',
    path: '/list',
    routes: [
      {
        redirect: 'sub-page',
      },
      {
        path: 'sub-page',
        name: 'SubPage',
        component: () => import('@pages/demo/sub-page'),
      },
      {
        // 绝对路径
        path: '/list/sub-page2',
        name: 'demo页',
        routes: [
          {
            redirect: 'sub-page2',
          },
          {
            // 绝对路径
            path: 'sub-demo',
            name: 'sub-demo',
            component: () => import('@pages/demo'),
          },
          {
            // 绝对路径
            path: 'sub-page2',
            name: 'sub-page2',
            component: () => import('@pages/demo/index'),
          },
          {
            path: '/sub-page3',
            name: 'sub-page3',
            component: () => import('@pages/demo/sub-page3'),
          },
        ],
      },
    ],
  },
];
