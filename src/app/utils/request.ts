import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
/* tslint:disable-next-line */
const axiosRetry = require('axios-retry'); // https://github.com/softonic/axios-retry/issues/53

import { env, history } from 'app/config';
import { externalUrls, publicUrls, urls } from 'app/routes';
import { requestAccountToken } from 'app/services/user/userRequests';
import { refreshTokenAxios } from './refreshToken';

const refreshTokenInstance = refreshTokenAxios();
// Retry on a network error or a 5xx error on an idempotent request https://github.com/softonic/axios-retry
// You can disable retry by request adding {'axios-retry': { retries: 0 }} to axios config
axiosRetry(axios, {
  retries: 3,
  retryCondition: (err: AxiosError) => err.config.method === 'get'
});

// Redirect to login page in case of 401
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status, data, config } = error.response;
    const { pathname } = location;
    if (status === 401) {
      // Token Refresh
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
