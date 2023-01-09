import { Request, Response } from 'express';
import { User } from '../../@types';

import { firestore } from '../../firebaseConfig';
import { getDomainFromEmail } from '../helper';


const getTenantDetails = async (req: Request, res: Response) => {
    // TODO: Email validation
    try {
        const { email } = req.params;

        const domain = getDomainFromEmail(email);

        const tenantRef = await firestore.collection('tenants').where('tenantName', '==', domain).get();
        if(tenantRef.docs.length === 0) {
            return res.status(400).json({ message: 'Tenant not found.' })
        }
        const tenantData = tenantRef.docs[0].data();

        //Check the user exist on the tenant
        const userDoc = await firestore.collection('users').where('tenant_id', '==', tenantData.tenantId).where('email', '==', email).get();
        if(userDoc.docs.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const userData = userDoc.docs[0].data() as User;
        
        
        const providerRef = await firestore.collection('tenants').doc(tenantData.tenantId).collection('providers').where('enabled', '==', true).get();
        if(providerRef.docs.length === 0 ) {
            return res.status(400).json({ message: 'No provider configured.'})
        }

        const provider = providerRef.docs[0].data()

        return res.status(200).json({ tenantId: tenantData.tenantId, provider, resetPassword: userData?.reset_password });

    } catch (error) {

        return res.status(500).json(error)
    }
    
}

const getTenant = async (req: any, res: Response) => {
    try {
        const { tenantId } = req.params;
        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', tenantId).get();

        if(tenantDoc.docs.length === 0) {
            return res.status(400).json({ message: 'Tenant not found.' });
        }

        const tenant = tenantDoc.docs[0].data();

        const providerRef = await firestore.collection('tenants').doc(tenantId).collection('providers').where('enabled', '==', true).get();

        const provider = providerRef.docs[0].data()
    
        return res.status(200).json({ tenant, provider });
    } catch (error: any) {
        console.log('error',error);
        return res.send(error?.message)
    }
}

const updateTenant = async (req: any, res: Response) => {
    try {
        const { tenantId } = req.params;
        const { logoUrl, displayName } = req.body;

        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', tenantId).get();

        if(tenantDoc.docs.length === 0) {
            return res.status(400).json({ message: 'Tenant not found.' });
        }

        const params: any = {};
        if(logoUrl) params.logoUrl = logoUrl;
        if(displayName) params.displayName = displayName;

        if(Object.keys(params).length) {
            await firestore.collection('tenants').doc(tenantDoc.docs[0].id).update(params);
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error: any) {
        console.log('error',error);
        return res.status(500).json({ message: error?.message })
    }
}

const getPartnerTenant = async (req: any, res: Response) => {
    try {
        const { tenantId } = req.params;
        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', tenantId).where('isPartner', '==', true).get();

        if(tenantDoc.docs.length === 0) {
            return res.status(400).json({ message: 'Tenant not found.' });
        }

        const partner = tenantDoc.docs[0].data()

        return res.status(200).json({ partner  })
    } catch (error: any) {
        console.log('error',error);
        return res.status(500).json({ message: error?.message })
    }
}

export {
    getTenantDetails,
    getTenant,
    updateTenant,
    getPartnerTenant,
} 