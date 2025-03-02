import axios, { AxiosResponse } from 'axios';
import { SERVER_URL } from '../lib/constants';

export const serverClient = axios.create({
  baseURL: SERVER_URL,
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
    if (token) {
      config.headers['X-CSRFTOKEN'] = token;
    }
  }
  return config;
});

export const serverSideServerClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Referer: SERVER_URL
  }
});

export const fetcher = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await serverClient.get(url);
  return response.data;
};
