import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:252
 * @route '/accounts/fee-hub/analytics'
 */
        analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
export const feeTypes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeTypes.url(options),
    method: 'get',
})

feeTypes.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/fee-types',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
feeTypes.url = (options?: RouteQueryOptions) => {
    return feeTypes.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
feeTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeTypes.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
feeTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feeTypes.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
    const feeTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feeTypes.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
        feeTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeTypes.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:253
 * @route '/accounts/fee-hub/fee-types'
 */
        feeTypesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeTypes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feeTypes.form = feeTypesForm
/**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
export const profiles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profiles.url(options),
    method: 'get',
})

profiles.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/profiles',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
profiles.url = (options?: RouteQueryOptions) => {
    return profiles.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
profiles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profiles.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
profiles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profiles.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
    const profilesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profiles.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
        profilesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profiles.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:254
 * @route '/accounts/fee-hub/profiles'
 */
        profilesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profiles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profiles.form = profilesForm
/**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
export const students = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: students.url(options),
    method: 'get',
})

students.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/students',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
students.url = (options?: RouteQueryOptions) => {
    return students.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
students.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: students.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
students.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: students.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
    const studentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: students.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
        studentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: students.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:257
 * @route '/accounts/fee-hub/students'
 */
        studentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: students.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    students.form = studentsForm
/**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
export const regulations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: regulations.url(options),
    method: 'get',
})

regulations.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/regulations',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
regulations.url = (options?: RouteQueryOptions) => {
    return regulations.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
regulations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: regulations.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
regulations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: regulations.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
    const regulationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: regulations.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
        regulationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: regulations.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:258
 * @route '/accounts/fee-hub/regulations'
 */
        regulationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: regulations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    regulations.form = regulationsForm
/**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
export const collectionSettings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collectionSettings.url(options),
    method: 'get',
})

collectionSettings.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/collection-settings',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
collectionSettings.url = (options?: RouteQueryOptions) => {
    return collectionSettings.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
collectionSettings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collectionSettings.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
collectionSettings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: collectionSettings.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
    const collectionSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: collectionSettings.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
        collectionSettingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: collectionSettings.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:260
 * @route '/accounts/fee-hub/collection-settings'
 */
        collectionSettingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: collectionSettings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    collectionSettings.form = collectionSettingsForm
/**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
export const dues = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dues.url(options),
    method: 'get',
})

dues.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/dues',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
dues.url = (options?: RouteQueryOptions) => {
    return dues.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
dues.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dues.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
dues.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dues.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
    const duesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dues.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
        duesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dues.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:261
 * @route '/accounts/fee-hub/dues'
 */
        duesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dues.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dues.form = duesForm
/**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
export const adHocCharges = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adHocCharges.url(options),
    method: 'get',
})

adHocCharges.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/ad-hoc-charges',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
adHocCharges.url = (options?: RouteQueryOptions) => {
    return adHocCharges.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
adHocCharges.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adHocCharges.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
adHocCharges.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adHocCharges.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
    const adHocChargesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: adHocCharges.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
        adHocChargesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: adHocCharges.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:262
 * @route '/accounts/fee-hub/ad-hoc-charges'
 */
        adHocChargesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: adHocCharges.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    adHocCharges.form = adHocChargesForm
/**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
export const configurations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: configurations.url(options),
    method: 'get',
})

configurations.definition = {
    methods: ["get","head"],
    url: '/accounts/fee-hub/configurations',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
configurations.url = (options?: RouteQueryOptions) => {
    return configurations.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
configurations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: configurations.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
configurations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: configurations.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
    const configurationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: configurations.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
        configurationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: configurations.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:263
 * @route '/accounts/fee-hub/configurations'
 */
        configurationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: configurations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    configurations.form = configurationsForm