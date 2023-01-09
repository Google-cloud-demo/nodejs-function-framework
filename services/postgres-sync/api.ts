import axios, { AxiosRequestConfig } from "axios";

class API {
  constructor() {
    axios.defaults.baseURL = process.env.CORE_DB_SYNC_BASE_URL;

    // axios.interceptors.request.use(
    //   async (config: any) => {
    //     // const token = await auth.currentUser?.getIdToken()
    //     // if (token) {
    //     //     config.headers['Authorization'] = 'Bearer ' + token
    //     // }
    //     // config.headers['Content-Type'] = 'application/json';
    //     return config
    // },
    //   error => {
    //     Promise.reject(error)
    //   }
    // )
  }

  get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return axios.get(url, config);
  }

  post(url: string, params: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.post(url, params, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.patch(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return axios.delete(url, config);
  }
}

export default new API();
