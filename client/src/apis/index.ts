import axios from 'axios';

const axiosOptions = {
  baseURL: 'https://127.0.0.1:8080',
  withCredentials: true,
};

const defaultAxios = axios.create(axiosOptions);

export { defaultAxios };
