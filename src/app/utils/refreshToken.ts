import { env } from 'app/config';
import { externalUrls } from 'app/routes';
import axios from 'axios';

export function refreshToken() {
  const requestConfig = {
    ...axios.defaults,
    baseURL: `${env.accountServerUrl}`,
    withCredentials: true,
  }
  const instance = axios.create(requestConfig);

  instance.interceptors.response.use(
    undefined,
    async (error) => {
      if (error.response) {
        const { status, config } = error.response;
        const { href } = location;
        if (status === 401) {
          try {
            await
              instance.get(`/ridi/authorize/`, {
                params: {
                  client_id: process.env.OAUTH2_CLIENT_ID,
                  response_type: 'code',
                  redirect_uri: `https://${process.env.ACCOUNT_SERVER_HOST}/ridi/complete/`
                }
              })
            // 인증 성공 시 기존에 하던 request 재시도
            instance.request(config)
          } catch (e) {
            const returnUrl = encodeURIComponent(href);
            location.replace(`${externalUrls.RIDIBOOKS_LOGIN}?return_url=${returnUrl}`);
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

