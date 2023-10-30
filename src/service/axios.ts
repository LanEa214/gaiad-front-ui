import { message } from 'antd';
import axios from 'axios';
import Cookie from 'js-cookie';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { KEY_TOKEN, DEFAULT_ERROR_MESSAGE, RESPONSE_SUCCESS_CODES } from '@common/constant';
import { getToken, onTokenInvalid } from '@utils/utils';

// axios 文档 https://axios-http.com/zh/docs/req_config

const handleTokenInvalid = (response: AxiosResponse & Record<string, any>) => {
  const { data, type } = response;
  if (type === 'opaqueredirect' || data?.message === '用户未登录' || data?.code === 'E0000010009') {
    // 鉴权未通过
    onTokenInvalid();
  }
};

const handleRequestErrorMessage = (response: AxiosResponse) => {
  const { data } = response;
  const msg = data?.message || DEFAULT_ERROR_MESSAGE;
  message.error({
    content: msg,
    key: 'GLOBAL_ERROR_MESSAGE', // 防止报错信息出现一大串
  });
};

const isSuccess = (code: string | number): boolean => {
  if (code === undefined || code === null || code === '') {
    return false;
  }
  return RESPONSE_SUCCESS_CODES.includes(code);
};

axios.interceptors.request.use(
  (config) => {
    if (Cookie.get(KEY_TOKEN)) {
      config.headers.Authorization = config.headers.Authorization || getToken();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (typeof data === 'object' && !isSuccess(data?.code)) {
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    return Promise.reject(response);
  },
);

axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_API_PATH;

export type RequestConfig = AxiosRequestConfig & {
  // 下载流时需要传，将整个response返回，自己处理
  getResponse?: boolean;
  // 是否需要跳过默认的错误处理，比如：需要自定义error 提示
  skipErrorHandle?: boolean;
};

/**
 * 统一的request 入口
 * @param config {AxiosRequestConfig}
 * @returns {Promise<any>}
 */
export function request(url: string, config?: RequestConfig): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({ url, ...config })
      .then((res) => {
        // resolve(config?.getResponse ? res : res.data);
        /* 兼容不同的返回 */
        resolve(config?.getResponse ? res : res.data?.content ?? res.data?.data);
      })
      .catch((errorRes) => {
        if (!config?.skipErrorHandle) {
          handleRequestErrorMessage(errorRes);
        }
        handleTokenInvalid(errorRes);
        reject(errorRes?.data);
      });
  });
}
