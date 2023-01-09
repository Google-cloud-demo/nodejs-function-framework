import { Response } from 'express';
import { User } from '../../@types';
import { firestore } from '../../firebaseConfig';

const listSubscriptions = async (req: any, res: Response) => {

    try {
        const userDoc = await firestore.collection('users')
            // .where('tenant_id', '==', req.tenant)
            .where('uid', '==', req?.uid).get();
        const userData = userDoc.docs[0].data() as User;

        // Only active subscriptions
        const subIds = userData.subscriptions.filter(s => !s.disabled).map(s => s.sub_id);
        
        const tenants: string[] = [];
        const subDocs = await firestore.collection('subscriptions')
        // .where('tenant_id', '==', req.tenant)
        .where('subscription_id', 'in', subIds).get();
        let subscriptions = subDocs.docs.map(d => {
            const data = d.data();
            const sub = userData.subscriptions.find(s => s?.sub_id === data.subscription_id)
            data.role = sub?.role;
            data.isPartner = !!sub?.isPartnerSubscription;
            tenants.push(data?.tenant_id);
            return data;
        });

        const tenantDocs = await firestore.collection('tenants').where('tenantId', 'in', tenants).get();
        const tenantData = tenantDocs.docs.map(d => d.data());
        subscriptions = subscriptions?.map((s: any) => {
            const tenant = tenantData?.find( t=> t?.tenantId === s?.tenant_id);
            if(tenant){
                s.logo = tenant.logoUrl;
                s.tenantName = tenant.displayName
            } 
            return s
        })
        return res.status(200).json({ subscriptions })
        
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

export {
    listSubscriptions
}