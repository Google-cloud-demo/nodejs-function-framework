export interface Tenant {
    tenantId: string,
    tenantName: string,
    displayName: string,
    domainName: string,
    logo?: string,
    createdOn?: string,
    partners?: Partner[]
}

export type Partner = {
    partnerTenantId: string,
    partnerDomainName: string,
    subscriptions: string[]
}

export type UserSub = {
    sub_id: string,
    role?: string,
    disabled?: string,
    last_signed_in?: number,
    created_on?: number,
    updated_on?: number,
    isPartnerSubscription?: boolean,
    partnerId?: string,
}
export interface User {
    uid: string,
    email: string,
    name?: string,
    tenant_id: string,
    subscriptions: Array<UserSub>,
    subscriptionIds: Array<string>,
    created_on?: number,
    reset_password?: boolean,
    is_tenant_admin?: boolean,
    last_signed_in?: number,
}

export interface Subscription {
    subscription_id: string,
    subscription_type: 'standard' | 'premium',
    tenant_id: string,
    users: Array<string>,
    created_on?: number,
    updated_on?: number,
}

export interface Role {
    role: string,
    permissions: Array<string>
}