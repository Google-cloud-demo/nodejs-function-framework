import api from "./api";

class TenantService {

    //Deprecated
    addTenant = (data: any) => {
        return api.post(`/tenants`, data);
    }

    addSubscription = (data:any) => {
        return api.post('/subscriptions', data);
    }

    deleteSubscription = (subscriptionId: string) => {
        return api.delete(`/subscriptions/${subscriptionId}`);
    }
}

export default new TenantService();