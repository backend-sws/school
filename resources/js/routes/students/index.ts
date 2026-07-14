import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import manageF1b31d from './manage'
/**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/students/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:301
 * @route '/students/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:301
 * @route '/students/analytics'
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
 * @see routes/web.php:302
 * @route '/students/manage'
 */
export const manage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(options),
    method: 'get',
})

manage.definition = {
    methods: ["get","head"],
    url: '/students/manage',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
manage.url = (options?: RouteQueryOptions) => {
    return manage.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
manage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
manage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
    const manageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manage.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
        manageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manage.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:302
 * @route '/students/manage'
 */
        manageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manage.form = manageForm
/**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
export const candidate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidate.url(options),
    method: 'get',
})

candidate.definition = {
    methods: ["get","head"],
    url: '/students/candidate',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
candidate.url = (options?: RouteQueryOptions) => {
    return candidate.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
candidate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidate.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
candidate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: candidate.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
    const candidateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: candidate.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
        candidateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidate.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:305
 * @route '/students/candidate'
 */
        candidateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    candidate.form = candidateForm
const students = {
    analytics: Object.assign(analytics, analytics),
manage: Object.assign(manage, manageF1b31d),
candidate: Object.assign(candidate, candidate),
}

export default students