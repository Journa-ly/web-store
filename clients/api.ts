// lib/apiClient.ts
import axios from 'axios';

/**
 * A pre-configured Axios instance for calling internal Next.js API routes.
 *
 * By default, we set the baseURL to '/api', so calls like apiClient.post("/some-route")
 * become POST requests to "/api/some-route".
 *
 * Adjust the baseURL if you need an absolute URL (e.g., for SSR or production).
 */
const baseURL = process.env.NEXT_PUBLIC_APP_URL;

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`
});

// Optional: Add an example interceptor (e.g., to add auth headers or handle errors).
// apiClient.interceptors.request.use(
//   (config) => {
//     // For instance, attach an authorization header if needed
//     // config.headers.Authorization = `Bearer ${YOUR_JWT_TOKEN}`;
//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Optionally handle common response errors here
//     return Promise.reject(error);
//   }
// );
