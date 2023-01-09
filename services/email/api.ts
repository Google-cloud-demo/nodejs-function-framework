import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class API {
  axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient =  axios.create({ baseURL: 'https://hati1e97tb.execute-api.us-east-1.amazonaws.com' })
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
