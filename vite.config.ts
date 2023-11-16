import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
// import vitePluginImp from 'vite-plugin-imp';

import proxyConfig from './config/proxy';
import projectConfig from './config/config';
const packageInfo = require('./package.json');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        babel: {
          parserOpts: {
            plugins: ['decorators-legacy'],
          },
        },
      }),

      // vitePluginImp({
      //   libList: [
      //     {
      //       libName: 'antd',
      //       style: (name) => `antd/es/${name}/style`,
      //     },
      //   ],
      // }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@service': resolve(__dirname, 'src/service'),
        '@common': resolve(__dirname, 'src/common'),
        '@components': resolve(__dirname, 'src/components'),
        '@hook': resolve(__dirname, 'src/hook'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@routes': resolve(__dirname, 'src/routes'),
        '@config': resolve(__dirname, 'src/config'),
        '~antd': resolve(__dirname, 'node_modules/antd'),
        // 适配umi
        '@umijs/max': resolve(__dirname, 'src/utils/umi.ts'),
        umi: resolve(__dirname, 'src/utils/umi.ts'),
      },
    },
    build: {
      reportCompressedSize: false,
      target: 'es2015',
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks: {
            lodash: ['lodash'],
            moment: ['moment'],
            'react-vendor': ['react', 'react-dom'],
            antd: ['antd'],
            'ant-icons': ['@ant-design/icons'],
            'ant-pro': ['@ant-design/pro-components'],
          },
        },
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': projectConfig.primaryColor,
          },
        },
      },
    },
    server: {
      proxy: proxyConfig,
    },
    base: env.VITE_PUBLIC_RES_PATH,
    // https://vitejs.dev/config/shared-options.html#define:~:text=string%20values%20will%20be%20used%20as%20raw%20expressions%2C%20so%20if%20defining%20a%20string%20constant%2C%20it%20needs%20to%20be%20explicitly%20quoted%20(e.g.%20with%20JSON.stringify)
    define: {
      TEST_NAME: JSON.stringify(env.TEST_NAME),
      // 如果是和gaia 是一个系统，设置bestudio
      GAIA_PACKAGE_NAME: JSON.stringify(packageInfo.name),
      GAIA_COMMIT_INFO: JSON.stringify(env.GAIA_COMMIT_INFO),
      GAIA_APP_VERSION: JSON.stringify(packageInfo?.version),
      PUBLIC_RESOURCE_STATIC_PATH: JSON.stringify(env.VITE_PUBLIC_RES_PATH),
      'process.env': {},
    },
  };
});
