import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import types907509 from './types'
import applications17f98b from './applications'
import idCards from './id-cards'
/**
 * @see routes/web.php:345
 * @route '/certificates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/certificates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:345
 * @route '/certificates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:345
 * @route '/certificates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:345
 * @route '/certificates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:345
 * @route '/certificates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:345
 * @route '/certificates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:345
 * @route '/certificates'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
export const manageCertificateHead = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCertificateHead.url(options),
    method: 'get',
})

manageCertificateHead.definition = {
    methods: ["get","head"],
    url: '/certificates/manage-certificate-head',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
manageCertificateHead.url = (options?: RouteQueryOptions) => {
    return manageCertificateHead.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
manageCertificateHead.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCertificateHead.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
manageCertificateHead.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageCertificateHead.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
    const manageCertificateHeadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manageCertificateHead.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
        manageCertificateHeadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCertificateHead.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:346
 * @route '/certificates/manage-certificate-head'
 */
        manageCertificateHeadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCertificateHead.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manageCertificateHead.form = manageCertificateHeadForm
/**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
export const manageCertificateRules = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCertificateRules.url(options),
    method: 'get',
})

manageCertificateRules.definition = {
    methods: ["get","head"],
    url: '/certificates/rules',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
manageCertificateRules.url = (options?: RouteQueryOptions) => {
    return manageCertificateRules.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
manageCertificateRules.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCertificateRules.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
manageCertificateRules.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageCertificateRules.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
    const manageCertificateRulesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manageCertificateRules.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
        manageCertificateRulesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCertificateRules.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:347
 * @route '/certificates/rules'
 */
        manageCertificateRulesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCertificateRules.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manageCertificateRules.form = manageCertificateRulesForm
/**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
export const types = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: types.url(options),
    method: 'get',
})

types.definition = {
    methods: ["get","head"],
    url: '/certificates/types',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
types.url = (options?: RouteQueryOptions) => {
    return types.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
types.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: types.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
types.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: types.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
    const typesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: types.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
        typesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: types.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:349
 * @route '/certificates/types'
 */
        typesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: types.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    types.form = typesForm
/**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
export const applications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})

applications.definition = {
    methods: ["get","head"],
    url: '/certificates/applications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:353
 * @route '/certificates/applications'
 */
        applicationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    applications.form = applicationsForm
const certificates = {
    index: Object.assign(index, index),
manageCertificateHead: Object.assign(manageCertificateHead, manageCertificateHead),
manageCertificateRules: Object.assign(manageCertificateRules, manageCertificateRules),
types: Object.assign(types, types907509),
applications: Object.assign(applications, applications17f98b),
idCards: Object.assign(idCards, idCards),
}

export default certificates