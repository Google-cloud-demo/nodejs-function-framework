import { AxiosRequestConfig } from "axios";
import api from "./api";

class EmailService {

  sendMail = (data: any) => {
    const config: AxiosRequestConfig = {};
    config.headers = {}
    config.headers['Content-Type'] = 'application/json';
    config.headers['x-api-key'] = 'PbOCeaHmkz86t5XltUhH42QUDDdfymjL1gZ9YwO6';
    return api.post(`/user/mail`, data, config);
  }

}

export default new EmailService();