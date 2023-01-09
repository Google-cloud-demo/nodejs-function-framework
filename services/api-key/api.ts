import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class API {
  axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient =  axios.create({ baseURL: process.env.API_KEY_SERVICE_BASE_URL })
   
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
    return this.axiosClient.get(url, config);
  }

  post(url: string, params: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.axiosClient.post(url, params, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.axiosClient.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.axiosClient.patch(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.axiosClient.delete(url, config);
  }
}

export default new API();
