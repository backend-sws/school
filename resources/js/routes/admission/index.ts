import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import headsC7aea8 from './heads'
import applications17f98b from './applications'
import readmissions9e9812 from './readmissions'
import analytics from './analytics'
/**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admission/stats',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:303
 * @route '/admission/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
export const manageCourse = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCourse.url(options),
    method: 'get',
})

manageCourse.definition = {
    methods: ["get","head"],
    url: '/admission/manage-course',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
manageCourse.url = (options?: RouteQueryOptions) => {
    return manageCourse.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
manageCourse.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageCourse.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
manageCourse.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageCourse.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
    const manageCourseForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manageCourse.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
        manageCourseForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCourse.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:304
 * @route '/admission/manage-course'
 */
        manageCourseForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageCourse.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manageCourse.form = manageCourseForm
/**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
export const heads = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})

heads.definition = {
    methods: ["get","head"],
    url: '/admission/heads',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
heads.url = (options?: RouteQueryOptions) => {
    return heads.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
heads.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
heads.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: heads.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
    const headsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: heads.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
        headsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: heads.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:306
 * @route '/admission/heads'
 */
        headsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: heads.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    heads.form = headsForm
/**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
export const applications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})

applications.definition = {
    methods: ["get","head"],
    url: '/admission/applications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:311
 * @route '/admission/applications'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:311
 * @route '/admission/applications'
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
/**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
export const promotions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promotions.url(options),
    method: 'get',
})

promotions.definition = {
    methods: ["get","head"],
    url: '/admission/promotions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
promotions.url = (options?: RouteQueryOptions) => {
    return promotions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
promotions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promotions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
promotions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: promotions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
    const promotionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: promotions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
        promotionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promotions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:318
 * @route '/admission/promotions'
 */
        promotionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promotions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    promotions.form = promotionsForm
/**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
export const readmissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissions.url(options),
    method: 'get',
})

readmissions.definition = {
    methods: ["get","head"],
    url: '/admission/readmissions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
readmissions.url = (options?: RouteQueryOptions) => {
    return readmissions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
readmissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
readmissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: readmissions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
    const readmissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: readmissions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
        readmissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:319
 * @route '/admission/readmissions'
 */
        readmissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    readmissions.form = readmissionsForm
/**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/admission',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:45
 * @route '/settings/admission'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:45
 * @route '/settings/admission'
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
const admission = {
    stats: Object.assign(stats, stats),
manageCourse: Object.assign(manageCourse, manageCourse),
heads: Object.assign(heads, headsC7aea8),
applications: Object.assign(applications, applications17f98b),
promotions: Object.assign(promotions, promotions),
readmissions: Object.assign(readmissions, readmissions9e9812),
analytics: Object.assign(analytics, analytics),
index: Object.assign(index, index),
}

export default admission