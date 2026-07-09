import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
export const daily = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})

daily.definition = {
    methods: ["get","head"],
    url: '/attendance/reports/daily',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
daily.url = (options?: RouteQueryOptions) => {
    return daily.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
daily.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: daily.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
daily.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: daily.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
    const dailyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: daily.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
        dailyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: daily.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:431
 * @route '/attendance/reports/daily'
 */
        dailyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: daily.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    daily.form = dailyForm
/**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/attendance/reports/summary',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:432
 * @route '/attendance/reports/summary'
 */
        summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
const reports = {
    daily: Object.assign(daily, daily),
summary: Object.assign(summary, summary),
}

export default reports