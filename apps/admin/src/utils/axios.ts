import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 3000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default instance;
