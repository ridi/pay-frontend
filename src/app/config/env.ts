/** variables defined by webpack.DefinePlugin */
declare const USE_MOCK_RESPONSES: boolean;
declare const RESPONSE_DELAY: number;
declare const API_SEVER_URL: string;
declare const BOOKS_SERVER_URL: string;
declare const ACCOUNT_SERVER_URL: string;

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  useMockResponses: typeof USE_MOCK_RESPONSES !== 'undefined' ? USE_MOCK_RESPONSES : false,
  responseDelay: typeof RESPONSE_DELAY !== 'undefined' ? RESPONSE_DELAY : 0,
  apiServerUrl: API_SEVER_URL,
  booksServerUrl: BOOKS_SERVER_URL,
  accountServerUrl: ACCOUNT_SERVER_URL,
};
