import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import superAdmin from './super-admin'
import users48860f from './users'
import rolesF85c84 from './roles'
import workflowsC7a9dd from './workflows'
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
export const superAdminLanding = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superAdminLanding.url(options),
    method: 'get',
})

superAdminLanding.definition = {
    methods: ["get","head"],
    url: '/super-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
superAdminLanding.url = (options?: RouteQueryOptions) => {
    return superAdminLanding.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
superAdminLanding.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superAdminLanding.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
superAdminLanding.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: superAdminLanding.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
    const superAdminLandingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: superAdminLanding.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
        superAdminLandingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: superAdminLanding.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\SuperAdminLandingController::superAdminLanding
 * @see app/Http/Controllers/Web/SuperAdminLandingController.php:22
 * @route '/super-admin'
 */
        superAdminLandingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: superAdminLanding.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    superAdminLanding.form = superAdminLandingForm
/**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:308
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
export const auditLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(options),
    method: 'get',
})

auditLogs.definition = {
    methods: ["get","head"],
    url: '/admin/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
auditLogs.url = (options?: RouteQueryOptions) => {
    return auditLogs.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
auditLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
auditLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: auditLogs.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
    const auditLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: auditLogs.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
        auditLogsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: auditLogs.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:558
 * @route '/admin/audit-logs'
 */
        auditLogsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: auditLogs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    auditLogs.form = auditLogsForm
/**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
export const importLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importLogs.url(options),
    method: 'get',
})

importLogs.definition = {
    methods: ["get","head"],
    url: '/admin/analytics/import-logs',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
importLogs.url = (options?: RouteQueryOptions) => {
    return importLogs.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
importLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importLogs.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
importLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importLogs.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
    const importLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importLogs.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
        importLogsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importLogs.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:559
 * @route '/admin/analytics/import-logs'
 */
        importLogsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importLogs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importLogs.form = importLogsForm
/**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
export const dataImport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataImport.url(options),
    method: 'get',
})

dataImport.definition = {
    methods: ["get","head"],
    url: '/admin/data-import',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
dataImport.url = (options?: RouteQueryOptions) => {
    return dataImport.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
dataImport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataImport.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
dataImport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dataImport.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
    const dataImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dataImport.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
        dataImportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dataImport.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:560
 * @route '/admin/data-import'
 */
        dataImportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dataImport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dataImport.form = dataImportForm
/**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/admin/roles',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
    const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: roles.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
        rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:592
 * @route '/admin/roles'
 */
        rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    roles.form = rolesForm
/**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
export const workflows = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workflows.url(options),
    method: 'get',
})

workflows.definition = {
    methods: ["get","head"],
    url: '/admin/workflows',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
workflows.url = (options?: RouteQueryOptions) => {
    return workflows.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
workflows.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workflows.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
workflows.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workflows.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
    const workflowsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: workflows.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
        workflowsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: workflows.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:596
 * @route '/admin/workflows'
 */
        workflowsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: workflows.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    workflows.form = workflowsForm
const admin = {
    superAdminLanding: Object.assign(superAdminLanding, superAdminLanding),
superAdmin: Object.assign(superAdmin, superAdmin),
users: Object.assign(users, users48860f),
auditLogs: Object.assign(auditLogs, auditLogs),
importLogs: Object.assign(importLogs, importLogs),
dataImport: Object.assign(dataImport, dataImport),
roles: Object.assign(roles, rolesF85c84),
workflows: Object.assign(workflows, workflowsC7a9dd),
}

export default admin