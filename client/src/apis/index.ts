import axios from 'axios';

const axiosOptions = {
  baseURL: 'http://ec2-13-49-67-157.eu-north-1.compute.amazonaws.com/api',
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
