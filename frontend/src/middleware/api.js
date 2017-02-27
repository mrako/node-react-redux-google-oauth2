import axios from 'axios';

export default class Api {
  static getClient() {
    const config = { baseURL: process.env.ENDPOINT };

    if (localStorage.getItem('user') !== null) {
      const user = JSON.parse(localStorage.getItem('user'));
      config.headers = { Authorization: `Bearer ${user.token}` };
    }

    const instance = axios.create(config);

    instance.interceptors.response.use(response => response,
      (error) => {
        if (error.response.status === 401) {
          // handle error
        }

        return Promise.reject(error);
      });

    return instance;
  }
}
