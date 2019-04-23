import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
/* tslint:disable-next-line */
const axiosRetry = require('axios-retry'); // https://github.com/softonic/axios-retry/issues/53

import { env, history } from 'app/config';
import { publicUrls, urls } from 'app/routes';
import { refreshToken } from './refreshToken';

const refreshTokenInstance = refreshToken();
// Retry on a network error or a 5xx error on an idempotent request https://github.com/softonic/axios-retry
// You can disable retry by request adding {'axios-retry': { retries: 0 }} to axios config
axiosRetry(axios, {
  retries: 3,
  retryDelay: () => 1000 + Math.floor(1000 * Math.random()),
  retryCondition: (err: AxiosError) => err.config.method === 'get'
});

// Redirect to login page in case of 401
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { data, config } = error.response;
    const { pathname } = location;
    if (data.code === 'LOGIN_REQUIRED') {
      // 401시 먼저 Token Refresh 후 Login Page로 Redirect /ridi/token 성공 시 원래의 request
      return refreshTokenInstance
        .post('/ridi/token/')
        .then(() => request(config));
    } else if (data.code === 'NOT_FOUND_USER') {
      if (!publicUrls.includes(pathname)) {
        history.replace(urls.SETTINGS);
      }
    }
    return Promise.reject(error.response);
  }
);

axios.defaults.timeout = env.isProduction ? 10000 : 30000;

export interface RequestConfig extends AxiosRequestConfig {
  'axios-retry'?: {
    retries: number;
  };
}

export function request(config: RequestConfig) {
  config.baseURL = `//${process.env.RIDI_PAY_API_SERVER_HOST}`;
  config.withCredentials = true;
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json'
  };
  // Workaround to set Content-Type: https://github.com/axios/axios/issues/86
  config.data = config.data || {};
  return axios(config);
}

const mockAxiosInstance = axios.create();
export function getMockRequest(mockHandler: (mock: MockAdapter) => void) {
  const mock = new MockAdapter(mockAxiosInstance, { delayResponse: 2000 });
  mockHandler(mock);
  return function mockRequest(config: RequestConfig): AxiosPromise {
    return axios(config);
  };
}
