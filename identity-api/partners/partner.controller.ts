import {  Response } from 'express';
import { Partner, User } from '../../@types';
import { firestore } from '../../firebaseConfig';

const listPartners =  async (req: any, res: Response) => {
    try {
        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', req.tenant).get();
        const tenantData = tenantDoc.docs[0].data();
        const partners = tenantData?.partners || [];

        
        return res.status(200).json({ partners})
    } catch (error: any) {
        console.log('List Partners Error',error);
        return res.status(500).json({ message: error?.message })
    }
}
const createPartner = async (req: any, res: Response) => {
    try {
        const { partnerId } = req.body;
        const { subscriptionId } = req.params;

        const partnerTenantDoc = await firestore.collection('tenants').where('tenantId', '==', partnerId).where('isPartner', '==', true).get();
        if(partnerTenantDoc.docs.length === 0) {
            return res.status(400).json({ message: 'Cannot add this tenant as partner.' });
        }

        const partnerTenantData = partnerTenantDoc.docs[0].data();
        
        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', req.tenant).get();
        const tenantData = tenantDoc.docs[0].data()
        const partners = tenantData?.partners || []; 

        const index = partners.findIndex((p: any) => p?.partnerTenantId === partnerId)
        if(index < 0) {
            const partner = {
                partnerTenantId: partnerId,
                partnerDomainName: partnerTenantData?.domainName,
                subscriptions: [subscriptionId]
            }
            partners.push(partner)
        }else {
            const partner = partners[index];
            if(partner?.subscriptions?.includes(subscriptionId)) {
                return res.status(400).json({ message: 'This tenant is already partnered with this subscription'})
            }
            partners[index].subscriptions?.push(subscriptionId);
        }
    
            
        await firestore.collection('tenants').doc(tenantDoc.docs[0].id).update({ partners })

        return res.status(200).json({ message: 'Success'})

    } catch (error: any) {
        console.log('error',error);
        return res.status(500).json({ message: error?.message })
    }
}


const deletePartners =  async (req: any, res: Response) => {
    try {
        const { subscriptionId, partnerId } = req.params;

        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', req.tenant).get();
        const tenantData = tenantDoc.docs[0].data();
        let partners: Partner[] = tenantData?.partners || [];

        const userDocs = await firestore.collection('users').where('subscriptionIds', 'array-contains', subscriptionId).get();

        const partnerUsers = userDocs.docs?.filter(d => {
            const user = d.data() as User;
            const sub = user?.subscriptions.find(s => s.sub_id === subscriptionId)
            return sub?.partnerId === partnerId
        });

        if(partnerUsers?.length === 0) {
            return res.status(400).json({ message: "Delete the user associated with the partner" })
        }

        const index = partners.findIndex((p: Partner) => p.partnerTenantId === partnerId);
        if(index >= 0) {
            partners[index].subscriptions = partners[index].subscriptions.filter(s => s !== subscriptionId);
            if(partners[index].subscriptions?.length === 0) {
                partners = partners.filter(p => p?.partnerTenantId !== partnerId)
            }
        }

        await firestore.collection('tenants').doc(tenantDoc?.docs[0]?.id).update({ partners });

        return res.status(200).json({ message: 'Success'})
    } catch (error: any) {
        console.log('Delete Partners Error',error);
        return res.status(500).json({ message: error?.message })
    }
}

export {
    listPartners,
    createPartner,
    deletePartners,
} 