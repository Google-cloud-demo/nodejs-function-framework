import { AxiosRequestConfig } from "axios";
import api from "./api";

class APIKeyService {

    addUser = (data: any, token?: string) => {
        const config: AxiosRequestConfig = {};
        config.headers = {}
        config.headers['Content-Type'] = 'application/json';
        if(token) {
            config.headers['service'] = 'iot';
            config.headers['Authorization'] = 'Bearer ' + token;
        }else {
            config.headers['api-identifier'] = 123456;
            config.headers['Authorization'] = 'Bearer ' + 'dummy';
        }
        return api.post(`/user`, data, config);
    }

    editUser = (data: any, token?: string) => {
        const config: AxiosRequestConfig = {};
        config.headers = {}
        config.headers['Content-Type'] = 'application/json';
        if(token) {
            config.headers['service'] = 'iot';
            config.headers['Authorization'] = 'Bearer ' + token;
        }else {
            config.headers['api-identifier'] = 123456;
            config.headers['Authorization'] = 'Bearer ' + 'dummy';
        }
        return api.patch(`/user`, data, config);
    }

    deleteUser = (email: string, subscriptionId: string, token?: string) => {
        const url = `/user/${email}/subscription/${subscriptionId}`;
        const config: AxiosRequestConfig = {};
        config.headers = {}
        config.headers['Content-Type'] = 'application/json';
        if(token) {
            config.headers['service'] = 'iot';
            config.headers['Authorization'] = 'Bearer ' + token;
        }else {
            config.headers['api-identifier'] = 123456;
            config.headers['Authorization'] = 'Bearer ' + 'dummy';
        }
        return api.delete(url, config);
    }


}

export default new APIKeyService();