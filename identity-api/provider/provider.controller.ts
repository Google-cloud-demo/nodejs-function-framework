import { Response } from 'express';
import { AuthProviderConfig } from 'firebase-admin/auth';
import { auth, firestore } from '../../firebaseConfig';

const listProviders = async (req: any, res: Response) => {

    const tenant = req.tenant;

    try {
        const providers = await firestore.collection('tenants').doc(tenant).collection('providers').get();
        const result = providers.docs.map(provider => ({ ...provider.data(), id: provider?.id }))
       
        return res.status(200).send(result)
        
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

const getProviderDetails = async (req: any, res: Response) => {
    try {
        const tenant = req.tenant;
        const { id } = req.params;
        const tenantAuth = auth.tenantManager().authForTenant(tenant);

        const providerDocRef = await firestore.collection('tenants').doc(tenant).collection('providers').doc(id).get();
        const providerDoc = providerDocRef.data();
        if(!providerDoc) {
            return res.status(400).json({ message: "Provider information not found." })
        }
        const provider = await tenantAuth.getProviderConfig(providerDoc.providerId);
        return res.status(200).json({ provider: { ...provider, providerType: providerDoc?.provider } });
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

const enableProvider = async (req: any, res: Response) => {
    try {
        const tenant = req.tenant;
        const { id } = req.params;
        const providerDocRef = await firestore.collection('tenants').doc(tenant).collection('providers').doc(id).get();
        const providerDoc = providerDocRef.data();
        if(!providerDoc) {
            return res.status(400).json({ message: "Provider information not found." })
        }

        const providersRef = await firestore.collection('tenants').doc(tenant).collection('providers').get()
        const batch = firestore.batch();

        await Promise.all(
            providersRef.docs.map(async (doc)=> {
                const docRef = firestore.collection('tenants').doc(tenant).collection('providers').doc(doc.id);
                const data = doc.data();
                
                if(doc.id === id) { // Enable provider
                    await enableDisableIdentityPlatform(tenant, data, true);
                    batch.update(docRef, { enabled: true })
                }else if(data?.enabled) { // Disable the previous configured provider
                    await enableDisableIdentityPlatform(tenant, data, false);
                    batch.update(docRef, { enabled: false })
                }
            })
        ) 

        await batch.commit();

        return res.status(200).json({ message: 'success' });

    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

const enableDisableIdentityPlatform = async (tenant: string, providerDoc: any, enabled: boolean) => {
    const tenantAuth = auth.tenantManager().authForTenant(tenant);
    if(providerDoc?.provider === 'saml') {
        await tenantAuth.updateProviderConfig(providerDoc?.providerId, { enabled })
    }else if(providerDoc?.provider === 'password') {
        await auth.tenantManager().updateTenant(tenant, {emailSignInConfig: {
            enabled
        }})
    } // TODO: Update Google and Microsoft
}

const updateProviderConfig = async (req: any, res: Response) => {
    try {
        const tenant = req.tenant;
        const { id } = req.params;
        const providerDocRef = await firestore.collection('tenants').doc(tenant).collection('providers').doc(id).get();
        const providerDoc = providerDocRef.data();
        if(!providerDoc) {
            return res.status(400).json({ message: "Provider information not found." })
        }

        if(providerDoc?.provider === 'saml') {
            const tenantAuth = auth.tenantManager().authForTenant(tenant);
    
            const { idpEntityId, ssoURL, rpEntityId, x509Certificates, displayName, callbackURL } = req.body;
        
            const config: any = {
                idpEntityId: idpEntityId, 
                ssoURL: ssoURL,
                x509Certificates: x509Certificates,
                rpEntityId: rpEntityId,
                callbackURL
            }
            if(displayName) {
                config.displayName = displayName
            }
            
            await tenantAuth.updateProviderConfig(providerDoc?.providerId, config)
        }

        return res.status(200).json({ message: 'success' });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const createSAMLProvider = async (req: any, res: Response) => {

    try {
        const tenant = req.tenant;
    
        const tenantAuth = auth.tenantManager().authForTenant(tenant);
    
        const { providerId, idpEntityId, ssoURL, rpEntityId, x509Certificates, displayName, callbackURL } = req.body;
    
        // Create only SAML providers
        const config: AuthProviderConfig = {
            providerId: providerId, // 'saml.okta',
            idpEntityId: idpEntityId, // 'http://www.okta.com/exk1c3zzbapofJ7o00h8',
            ssoURL: ssoURL, //'https://dev-212903.oktapreview.com/app/dev-212903_gcp_1/exk1c3zzbapofJ7o00h8/sso/saml',
            x509Certificates: x509Certificates,
            enabled: false,
            rpEntityId: rpEntityId, // 'okta'
            callbackURL
        }
        if(displayName) {
            config.displayName = displayName
        }
        
        await tenantAuth.createProviderConfig(config);

        // Add provider information in firestore
        const providerData = {
            provider: 'saml',
            enabled: false,
            providerId: providerId
        }
        await firestore.collection('tenants').doc(tenant).collection('providers').add(providerData)
        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const deleteSAMLProvider = async (req: any, res: Response) => {
    try {
        const tenantId = req.tenant;
        const { id } = req.params;
        const providerDocRef = await firestore.collection('tenants').doc(tenantId).collection('providers').doc(id).get();
        const providerDoc = providerDocRef.data();
        if(!providerDoc) {
            return res.status(400).json({ message: "Provider information not found." })
        }
    
        const tenantAuth = auth.tenantManager().authForTenant(tenantId);
        if(providerDoc?.provider === 'saml') {
            await tenantAuth.deleteProviderConfig(providerDoc?.providerId);
        }
        await firestore.collection('tenants').doc(tenantId).collection('providers').doc(id).delete();
        
        //Update email password provider
        if(providerDoc?.enabled) {  
            await auth.tenantManager().updateTenant(tenantId, {emailSignInConfig: {
                enabled: true
            }})

            const passwordProvider = await firestore.collection('tenants').doc(tenantId).collection('providers').where('provider', '==', 'password').get()
            await await firestore.collection('tenants').doc(tenantId).collection('providers').doc(passwordProvider.docs[0].id).update({
                enabled: true
            })
        }
        return res.status(200).json({ message: 'Success' });
        
    } catch (error) {
        return res.status(500).json(error)
    }
}
// const testCode = async() => {
//     try {
//             const batch = firestore.batch();
                // const docs = [
                //     { provider: 'password', providerId: 'password', enabled: true },
                //     { provider: 'saml', providerId: 'saml.okta', enabled: true },
                //     { provider: 'google', providerId: 'google.com', enabled: true },
                //     { provider: 'microsoft', providerId: 'microsoft.com', enabled: true },
                // ]
                // for(let i=0; i< docs.length; i++) {
                //     let doc = firestore.collection('tenants').doc('Gadgeon-di9ey').collection('providers').doc()
                //     batch.set(doc, docs[i]);
                // }

                // await batch.commit();
        
//     } catch (error) {
//         console.log(error);
//     }
// }
export {
    listProviders,
    createSAMLProvider,
    updateProviderConfig,
    deleteSAMLProvider,
    getProviderDetails,
    enableProvider
}