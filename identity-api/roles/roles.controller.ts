import { Response } from 'express';
import { firestore } from '../../firebaseConfig';

const listRoles = async (req: any, res: Response) => {
    try {

        const roleDocs = await firestore.collection('roles').get();
        const roles = roleDocs.docs.map(doc => doc.data());
            
        return res.status(200).json({ roles })
        
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

const getRole = async (req: any, res: Response) => {
    try {
        const { roleId } = req.params;
        
       const roleDocs = await firestore.collection('roles').where('role', '==', roleId).get();
       if(roleDocs.docs.length === 0){
            return res.status(400).json({ message: 'Role not found' });
       }

       const role = roleDocs.docs[0].data();

       return res.status(200).json({ role })
        
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

const populateRole = async (req: any, res: Response) => {
    try {
        const roleData = [
            {
                role: 'TenantAdmin',
                permissions: [
                    'omnicore.devices.bindGateway',
                    'omnicore.devices.unbindGateway',
                    'omnicore.devices.create',
                    'omnicore.devices.delete',
                    'omnicore.devices.get',
                    'omnicore.devices.list',
                    'omnicore.devices.sendCommand',
                    'omnicore.devices.update',
                    'omnicore.devices.updateConfig',
                    'omnicore.registries.create',
                    'omnicore.registries.delete',
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.registries.update',
                    'omnicore.users.create',
                    'omnicore.users.list',
                    'omnicore.users.delete',
                    'omnicore.users.update',
                    'omnicore.users.get',
                    'omnicore.providers.create',
                    'omnicore.providers.update',
                    'omnicore.providers.list',
                    'omnicore.providers.delete',
                    'omnicore.providers.get',
                    'omnicore.roles.create',
                    'omnicore.roles.update',
                    'omnicore.roles.list',
                    'omnicore.roles.delete',
                    'omnicore.roles.get',
                    'omnicore.sinks.create',
                    'omnicore.sinks.list',
                    'omnicore.sinks.delete',
                    'omnicore.sinks.get',
                    'omnicore.apikeys.create',
                    'omnicore.apikeys.list',
                    'omnicore.apikeys.delete',
                    'omnicore.apikeys.getKey',
            
                    'omnicore.tenant.update',
                    'omnicore.users.resetPassword',
                    'omnicore.users.createTenantAdmin',
                    'omnicore.audits.list',
                ]
            },
            {
                role: 'Admin',
                permissions: [
                    'omnicore.devices.bindGateway',
                    'omnicore.devices.unbindGateway',
                    'omnicore.devices.create',
                    'omnicore.devices.delete',
                    'omnicore.devices.get',
                    'omnicore.devices.list',
                    'omnicore.devices.sendCommand',
                    'omnicore.devices.update',
                    'omnicore.devices.updateConfig',
                    'omnicore.registries.create',
                    'omnicore.registries.delete',
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.registries.update',
                    'omnicore.users.create',
                    'omnicore.users.list',
                    'omnicore.users.delete',
                    'omnicore.users.update',
                    'omnicore.users.get',
                    'omnicore.providers.create',
                    'omnicore.providers.update',
                    'omnicore.providers.list',
                    'omnicore.providers.delete',
                    'omnicore.providers.get',
                    'omnicore.roles.create',
                    'omnicore.roles.update',
                    'omnicore.roles.list',
                    'omnicore.roles.delete',
                    'omnicore.roles.get',
                    'omnicore.sinks.create',
                    'omnicore.sinks.list',
                    'omnicore.sinks.delete',
                    'omnicore.sinks.get',
                    'omnicore.apikeys.create',
                    'omnicore.apikeys.list',
                    'omnicore.apikeys.delete',
                    'omnicore.apikeys.getKey',
                    'omnicore.audits.list',
                ]
            },
            {
                role: 'Viewer',
                permissions: [
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.devices.get',
                    'omnicore.devices.list',

                    'omnicore.sinks.list',
                    'omnicore.apikeys.list',
                ]
            },
            {
                role: 'Editor',
                permissions: [
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.devices.get',
                    'omnicore.devices.list',
                    'omnicore.devices.updateConfig',
                    'omnicore.devices.sendCommand',
                    'omnicore.devices.create',
                    'omnicore.devices.delete',
                    'omnicore.devices.update',
                    'omnicore.registries.create',
                    'omnicore.registries.delete',
                    'omnicore.registries.update',

                    'omnicore.sinks.list',
                    'omnicore.apikeys.list',
                ]
            },
            {
                role: 'DeviceController',
                permissions: [
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.devices.get',
                    'omnicore.devices.list',
                    'omnicore.devices.updateConfig',
                    'omnicore.devices.sendCommand',

                    'omnicore.sinks.list',
                    'omnicore.apikeys.list',
                ]
            },
            {
                role: 'Provisioner',
                permissions: [
                    'omnicore.registries.get',
                    'omnicore.registries.list',
                    'omnicore.devices.get',
                    'omnicore.devices.list',
                    'omnicore.devices.updateConfig',
                    'omnicore.devices.sendCommand',
                    'omnicore.devices.create',
                    'omnicore.devices.delete',
                    'omnicore.devices.update',

                    'omnicore.sinks.list',
                    'omnicore.apikeys.list',
                ]
            }
        ]
        
        const batch = firestore.batch();
        roleData.forEach(role=> {
            const docRef = firestore.collection('roles').doc();
            batch.set(docRef, role)
        })
        
        await batch.commit();
            
        return res.status(200).json({ message: 'success' });
        
    } catch (error: any) {
        return res.status(500).send(error?.message)
    }
}

export {
    listRoles,
    getRole,
    populateRole
}