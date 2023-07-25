# vite + ts + react + antd Pro

脱离 umijs，单独使用 pro-component

## File tree

```
.
├── README.md
├── dist build -------------------------- 后的静态文件 
├── index.html -------------------------- 渲染 html 模板 
├── env --------------------------------- 环境变量
├── jsconfig.json
├── package-lock.json
├── package.json
├── public ------------------------------ 公共资源
├── src --------------------------------- 源码目录
│   ├── App.tsx ------------------------- common layout 层 
│   ├── assets -------------------------- 放 image，svg，等静态资源 
│   ├── common -------------------------- 通用工具的文件夹
│   │   └── common.less ----------------- 公共样式，集成flex快捷className
│   ├── component ----------------------- 公共业务组件目录
│   ├── hook ---------------------------- 公共hook目录
│   ├── index.less ---------------------- 入口样式
│   ├── main.tsx ------------------------ 入口文件
│   ├── pages --------------------------- 页面集合目录
│   ├── routes
│   │   ├── index.tsx
│   │   └── routes.ts ------------------- 路由配置
│   ├── service
│   │   └── axios.ts -------------------- 请求 request公共处理
│   ├── utils --------------------------- 工具库目录
│   │   └── utils.ts -------------------- 工具库
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Path alias

```ts
  '@': resolve(__dirname, 'src'),
  '@pages': resolve(__dirname, 'src/pages'),
  '@service': resolve(__dirname, 'src/service'),
  '@common': resolve(__dirname, 'src/common'),
  '@hook': resolve(__dirname, 'src/hook'),
  '@component': resolve(__dirname, 'src/component'),
  '@assets': resolve(__dirname, 'src/assets'),
  '@utils': resolve(__dirname, 'src/utils'),
  '@routes': resolve(__dirname, 'src/routes'),
```

## Routes config

```ts
// 参考 https://procomponents.ant.design/components/layout#menudataitem
  {
    path: '/welcome',
    name: '欢迎',
    component: React.lazy(() => import('@pages/xxx')), // 这些写为了打包的时候自动分chunk
  },

  // 可以再同一父级下配置不同前缀路径的路由
  {
    path: '/list',
    name: 'demo页',
    routes: [
      {
        redirect: '/first/sub-page',
      },
      {
        path: '/first/sub-page', // 绝对路径
        name: 'demo111',
        hideInMenu: true,
        key: 'demo',
        component: React.lazy(() => import('@pages/xxx')),
      },
      {
        path: 'seconde-page', // 相对路径
        name: 'dem222',
        key: 'demo',
        component: React.lazy(() => import('@pages/xxx')),
      },
    ],
  },
```

## 嵌套路由

```ts
// route 配置
{
  path: '/path',
  // 自定义的字段，非官方
  hasChildRoutes： true,
  name: '欢迎',
  component: () => import('@pages/NestRoutes'),
}

// NestRoutes
const NestRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="apple" />} />
      <Route path="/" element={<App />}>
        <Route path="apple" element={<h1>apple</h1>} />
        <Route path="orange" element={<h1>orange</h1>} />
        <Route path="bannan" element={<h1>bannan</h1>} />
      </Route>
    </Routes>
  )
}

// App

const App = () => {
  return (
    <div>
    // common UI
      <div>
        // child will render in `Outlet`
        <Outlet />
      </div>
    </div>
  )
}

```

## less 用法

`less` 的用法遵循规范，`module` 形式，需要在后缀加`module.less`, 不加会被按照普通的`css`处理

- 普通使用方式

```less
import './index.less'

...

<div className="xxx">
```

- module 用法

```less
import s from './index.module.less'

...

<div className={s.xxx}>
```


## Environment Prepare

Install `node_modules`: 推荐使用 `yarn`

```bash
yarn install
```
```js
// 更新子模块
git submodule init
git submodule sync
git submodule update
```js

### Start project

```bash
npm run dev
```

### Build project

```bash
npm run build
```

### Format code

```bash
npm run prettier
```

### Eslint check and Fixed

```bash
npm run lint:fix
```
