import axios, { AxiosResponse } from 'axios';

const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN;
const baseURL = `${SERVER_DOMAIN}`;

export const serverClient = axios.create({
  baseURL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

serverClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];
    console.log(token);
    if (token) {
      config.headers['X-CSRFTOKEN'] = token;
    }
  }
  console.log(config);
  return config;
});

export const fetcher = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await serverClient.get(url);
  return response.data;
};
