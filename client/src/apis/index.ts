import axios from 'axios';

const axiosOptions = {
  baseURL: 'http://127.0.0.1:8080',
  withCredentials: true,
};

const defaultAxios = axios.create(axiosOptions);

defaultAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { defaultAxios };
