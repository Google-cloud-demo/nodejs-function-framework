export const permissions = {
    bindGateway: 'omnicore.devices.bindGateway',
    unbindGateway: 'omnicore.devices.unbindGateway',
    createDevice: 'omnicore.devices.create',
    deleteDevice: 'omnicore.devices.delete',
    getDevice: 'omnicore.devices.get',
    listDevice: 'omnicore.devices.list',
    sendCommand: 'omnicore.devices.sendCommand',
    updateDevice: 'omnicore.devices.update',
    updateConfig: 'omnicore.devices.updateConfig',
    createRegistry: 'omnicore.registries.create',
    deleteRegistry: 'omnicore.registries.delete',
    getRegistry: 'omnicore.registries.get',
    listRegistry: 'omnicore.registries.list',
    updateRegistry: 'omnicore.registries.update',
    createUser: 'omnicore.users.create',
    listUser: 'omnicore.users.list',
    deleteUser: 'omnicore.users.delete',
    updateUser: 'omnicore.users.update',
    getUser: 'omnicore.users.get',
    createProvider: 'omnicore.providers.create',
    updateProvider: 'omnicore.providers.update',
    listProvider: 'omnicore.providers.list',
    deleteProvider: 'omnicore.providers.delete',
    getProvider: 'omnicore.providers.get',
    createRole: 'omnicore.roles.create',
    updateRole: 'omnicore.roles.update',
    listRole: 'omnicore.roles.list',
    deleteRole: 'omnicore.roles.delete',
    getRole: 'omnicore.roles.get',
    createSink: 'omnicore.sinks.create',
    listSink: 'omnicore.sinks.list',
    deleteSink: 'omnicore.sinks.delete',
    getSink: 'omnicore.sinks.get',
    createAPIKey: 'omnicore.apikeys.create',
    listAPIKey: 'omnicore.apikeys.list',
    deleteAPIKey: 'omnicore.apikeys.delete',
    getAPIKey: 'omnicore.apikeys.get',

    updateTenant: 'omnicore.tenant.update',
    resetPassword: 'omnicore.users.resetPassword',
    listUserAudits: 'omnicore.audits.list',
    createTenantAdmin: 'omnicore.users.createTenantAdmin',
}

export const Roles = {
    'Admin': [
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
        'omnicore.apikeys.get',
        'omnicore.audits.list',
    ],
    'TenantAdmin': [
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
        'omnicore.apikeys.get',

        'omnicore.tenant.update',
        'omnicore.users.resetPassword',
        'omnicore.users.createTenantAdmin',
        'omnicore.audits.list',
    ],
    'Editor': [
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

        'omnicore.sinks.list',
        'omnicore.apikeys.list',
    ],
    'Provisioner': [
        'omnicore.devices.bindGateway',
        'omnicore.devices.unbindGateway',
        'omnicore.devices.create',
        'omnicore.devices.delete',
        'omnicore.devices.get',
        'omnicore.devices.list',
        'omnicore.devices.sendCommand',
        'omnicore.devices.update',
        'omnicore.devices.updateConfig',
        'omnicore.registries.get',
        'omnicore.registries.list',

        'omnicore.sinks.list',
        'omnicore.apikeys.list',
    ],
    'DeviceController': [
        'omnicore.devices.get',
        'omnicore.devices.list',
        'omnicore.devices.sendCommand',
        'omnicore.devices.updateConfig',
        'omnicore.registries.get',
        'omnicore.registries.list',

        'omnicore.sinks.list',
        'omnicore.apikeys.list',
    ],
    'Viewer': [
        'omnicore.devices.get',
        'omnicore.devices.list',
        'omnicore.registries.get',
        'omnicore.registries.list',

        'omnicore.sinks.list',
        'omnicore.apikeys.list',
    ]
}