import { Response } from 'express';

import { Subscription, Tenant, User, UserSub } from '../../@types';
import { auth, firestore } from '../../firebaseConfig';
import apiKeyService from '../../services/api-key/api-key.service';
import emailServices from '../../services/email/email.services';
import { permissions } from '../constants';
import { generateRandomPassword, getUserCreationMailTemplate } from '../helper';
// import { getDomainFromEmail } from '../helper';


const listUser = async (req: any, res: Response) => {
    try {
        // const tenantId = req.tenant;
        const { subId } = req.params;
        // const tenantAuth = auth.tenantManager().authForTenant(tenantId);

        // const userList = await tenantAuth.listUsers(100);

        const userDocs = await firestore.collection('users')
        // .where('tenant_id', '==', tenantId)
        .where('subscriptionIds', 'array-contains', subId).get();
        
        const users = userDocs?.docs?.map(doc => {
            const data = doc.data() as User;
            const sub = data.subscriptions.find(s => s.sub_id === subId)
            return {...data, role: sub?.role, disabled: sub?.disabled, created_on: sub?.created_on}
        })

        return res.status(200).json({ users })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

const existUser = async (req: any, res: Response) => {
    try {
        const tenantId = req.tenant;
        const { email } = req.params;

        const userDocs = await firestore.collection('users')
        .where('tenant_id', '==', tenantId)
        .where('email', '==', email).get();

        let userExist = false
        if(userDocs.docs.length) {
            userExist = true
        }

        return res.status(200).json({ userExist })

    } catch (error: any) {
        console.log(error?.message);
        return res.status(500).json({ message: error?.message })
    }
}

const createUser = async (req: any, res: Response) => {
    try {
        const tenantId = req.tenant;
        let userTenant = req.tenant;
        let partner = null;

        const { email, role } = req.body;
        const { subId } = req.params;

        let emailDomain = email.split('@')[1];
        const tenantDoc = await firestore.collection('tenants').where('tenantId', '==', tenantId).get();
        const tenantInfo = tenantDoc?.docs[0]?.data() as Tenant;

        if(emailDomain !== tenantInfo?.domainName) {
            partner = tenantInfo.partners?.find(p => p?.partnerDomainName === emailDomain);
            if(!partner) return res.status(400).json({ message: 'Cannot add this email to this tenant'});
            userTenant = partner.partnerTenantId;
        }
        
        if(role && role === 'TenantAdmin') {
            if(!req?.userPermissions?.includes(permissions.createTenantAdmin)) {
                return res.status(400).json({ message: 'Do not have permission to create tenant admin.' })
            }
        }


        const userDoc = await firestore.collection('users').where('email', '==', email).get();
        if(userDoc?.docs.length) {
            
            const userData = userDoc?.docs[0].data() as User;
            if(userData?.subscriptionIds.includes(subId)) {
                return res.status(400).json({ message: 'User already exist in the subscription'})
            }

            let subscriptionIds = [...userData?.subscriptionIds, subId];
            const subscription:any =  {
                sub_id: subId,
                role: role ? role : '',
                created_on: Date.now(),
                updated_on: Date.now(),
            }
            if(partner) {
                subscription.isPartnerSubscription = true,
                subscription.partnerId = partner?.partnerTenantId
            }
            let subscriptions = [...userData?.subscriptions, subscription];

            const updateFields: any = {};
            updateFields.subscriptionIds = subscriptionIds;
            updateFields.subscriptions = subscriptions;

            if(role && role === 'TenantAdmin') {
                const tenantSubscriptions = await getTenantSubscriptions(tenantId);
                updateFields.subscriptions = tenantSubscriptions;
                updateFields.subscriptionIds = tenantSubscriptions.map(s => s.sub_id);
                updateFields.is_tenant_admin = true;
            }

            await firestore.collection('users').doc(userDoc?.docs[0].id).update(updateFields)

            // Send mail
            const body = getUserCreationMailTemplate(email, role, tenantInfo?.domainName, '', subId);
            const emailData: any = {
                username: email,
                subject: 'OmniCore Access Credentials',
                body
            }
            await emailServices.sendMail(emailData);

            // Sync with APIKey service
            const params: any = {
                email,
                subscription_id: subId,
                role: role ? role : 'role',
            }
            await apiKeyService.editUser(params, req.authToken);

        }else {
            const providerRef = await firestore.collection('tenants').doc(userTenant).collection('providers').where('enabled', '==', true).get();
            const provider = providerRef.docs[0].data();
            let password = '';
            if(provider?.provider === 'password') {
                password = generateRandomPassword();
            }

            const tenantAuth = auth.tenantManager().authForTenant(userTenant);
            const userParams: any = { email, disabled: false};
            if(password) userParams.password = password
            const user = await tenantAuth.createUser(userParams)
    
            const subscription: any =  {
                sub_id: subId,
                role: role,
                created_on: Date.now(),
                updated_on: Date.now(),
            }
            if(partner) {
                subscription.isPartnerSubscription = true,
                subscription.partnerId = partner?.partnerTenantId
            }

            const newUser: User = {
                uid: user?.uid,
                email: email,
                name: '',
                tenant_id: userTenant,
                subscriptions: [subscription],
                subscriptionIds: [subId],
                created_on: Date.now(),
                reset_password: false,
            }

            if(role && role === 'TenantAdmin') {
                const subscriptions = await getTenantSubscriptions(tenantId)
                newUser.subscriptions = subscriptions;
                newUser.subscriptionIds = subscriptions.map(s => s.sub_id);
                newUser.is_tenant_admin = true;
            }

            await firestore.collection('users').add(newUser);

            // Send mail
            const body = getUserCreationMailTemplate(email, role, tenantInfo?.domainName, password, subId);
            const emailData: any = {
                username: user?.email,
                subject: 'OmniCore Access Credentials',
                body
            }

            await emailServices.sendMail(emailData);

            // Sync with APIKey service
            const params: any = {
                email,
                subscription_id: subId,
                role: role ? role : 'role',
            }
            if(password) params.password = password;
            await apiKeyService.addUser(params, req.authToken);
            
        }

        return res.status(200).send('success')
        
    } catch (error: any) {
        console.log('Create IAM user error', error);
        return res.status(500).json({ message: error?.message })
    }
}

const getTenantSubscriptions = async (tenantId: string, isPartner = false) => {
    try {
        const tenantSubscriptions = await firestore.collection('subscriptions').where('tenant_id', '==', tenantId).get();
        const subscriptions = tenantSubscriptions.docs.map(d => {
            const subscription = d.data() as Subscription;
            const s: UserSub = {
                sub_id: subscription.subscription_id,
                role: 'TenantAdmin',
                created_on: Date.now(),
                updated_on: Date.now(),
            }
            if(isPartner) {
                s.isPartnerSubscription = true
                s.partnerId = tenantId
            }
            return s
        })
        return subscriptions
    } catch (error) {
        return Promise.reject(error);
    }
}

const resetPassword = async (req: any, res: Response) => {
    try {
        const tenantId = req.tenant;
        const tenantAuth = auth.tenantManager().authForTenant(tenantId);

        const { password } = req.body;
        const { uid } = req.params;

        if(uid !== req.uid && !req?.userPermissions?.includes(permissions.resetPassword)) {
            return res.status(400).json({ message: 'Do not have permission to change password.'})
        }
        
        if(uid === req?.uid) {
            const userDoc = await firestore.collection('users').where('uid', '==', req?.uid).get();
            await firestore.collection('users').doc(userDoc.docs[0].id).update({
                reset_password: true
            })
        }

        await tenantAuth.updateUser(uid, { password });

        return res.status(200).json({ message: 'Success' })
    } catch (error: any) {
        console.log(error?.message);
        return res.status(500).json({ message: error?.message })
    }
}

const setAccessControl = async (req: any, res: Response) => {
    try {
        const { subId } = req.params;

        const userDocs = await firestore.collection('users').where('uid', '==', req?.uid).get();

        const user = userDocs?.docs[0].data() as User;

        const sub = user.subscriptions?.find(s => s.sub_id === subId);

        if(!sub) {
            return res.status(400).json({ message: 'Subscription not found'});
        }

        const tenantId = req.tenant;
        const tenantAuth = auth.tenantManager().authForTenant(tenantId);
        await tenantAuth.setCustomUserClaims(req?.uid, { role: sub?.role });
        return res.status(200).json({ message: 'success' })
    } catch (error: any) {
        return res.status(500).json({ message: error?.message })
    }
}

const updateUser = async (req: any, res: Response) => {
    try {
        // const tenantId = req.tenant;

        const { disabled, role } = req.body;
        const { subId, uid } = req.params;

        const userDoc = await firestore.collection('users').where('uid', '==', uid).get();
        if(userDoc?.docs.length === 0) return res.json({ message: 'User not found'});

        const userData = userDoc?.docs[0].data() as User;
        let subscriptions = userData.subscriptions;
        const subIndex = subscriptions.findIndex(s => s.sub_id === subId);
        if(subIndex < 0) return res.json({ message: 'User didn\'t have subscription'});
        
        const params: any = {};
        if(disabled != undefined) subscriptions[subIndex].disabled = disabled;
        subscriptions[subIndex].updated_on = Date.now();

        if(role) {
            subscriptions[subIndex].role = role;
            if(role === 'TenantAdmin') {
                const tenantSubscriptions = await getTenantSubscriptions(req?.tenant)
                subscriptions = tenantSubscriptions;
                params.subscriptionIds = tenantSubscriptions.map(s => s.sub_id);
                params.is_tenant_admin = true;
            }else{
                params.is_tenant_admin = false;
            }
        }

        params.subscriptions = subscriptions;
   
        await firestore.collection('users').doc(userDoc.docs[0].id).update(params)


        if(role) {
            await apiKeyService.editUser({
                email: userData.email,
                subscription_id: subId,
                role
            }, req.authToken)
        }

        return res.status(200).json({ message: "success" });
        
    } catch (error: any) {
        console.log(error?.message);
        return res.status(500).send(error)
    }
}


const deleteUser = async (req: any, res: Response) => {
    try {
        
        const { subId, uid } = req.params;

        let tenantId = req.tenant;
        
        const userDoc = await firestore.collection('users').where('uid', '==', uid).get();
        if(userDoc?.docs.length === 0) return res.json({ message: 'User not found'});

        const userData = userDoc?.docs[0].data() as User;

        const subscription = userData?.subscriptions.find(s => s.sub_id === subId)
        if(subscription?.isPartnerSubscription) tenantId = subscription?.partnerId;

        const subscriptions = userData.subscriptions?.filter(s => s.sub_id !== subId);
        const subscriptionIds = userData.subscriptionIds?.filter(s => s !== subId);
        await firestore.collection('users').doc(userDoc.docs[0].id).update({
            subscriptions,
            subscriptionIds
        })

        // TODO: Create audit log for user deletion

        // Delete user form identity platform, if the user is 
        if(subscriptionIds.length === 0) {
            const tenantAuth = auth.tenantManager().authForTenant(tenantId);
            await tenantAuth.deleteUser(uid);

            // Delete user from firestore
            await firestore.collection('users').doc(userDoc?.docs[0].id).delete();
            await firestore.collection('deletedUsers').add({
                uid: userData?.uid,
                email: userData.email,
                deleted_on: Date.now(),
                tenantId: userData?.tenant_id,
                deletedDoc: userData
            })
        }

        await apiKeyService.deleteUser(userData.email, subId, req.authToken);

        return res.status(200).json({ message: "success" });
        
    } catch (error: any) {
        console.log(error);
        return res.status(500).send(error)
    }
}

const SignInLogs = async (req: any, res: Response) => {
    try {
        const { time } = req.body;
        
        const userDoc = await firestore.collection('users').where('uid', '==', req?.uid).get();
        if(userDoc.docs.length === 0) {
            return res.status(400).json({ message: 'Invalid user'})
        }
        await firestore.collection('users').doc(userDoc.docs[0].id).update({
            last_signed_in: time,
            new_user: false
        })
        return res.status(200).json({ message: 'success' })
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error?.message})
    }
}

export {
    listUser,
    createUser,
    deleteUser,
    updateUser,
    existUser,
    resetPassword,
    setAccessControl,
    SignInLogs
}