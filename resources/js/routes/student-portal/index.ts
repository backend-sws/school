import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
export const notices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notices.url(options),
    method: 'get',
})

notices.definition = {
    methods: ["get","head"],
    url: '/student-portal/notices',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
notices.url = (options?: RouteQueryOptions) => {
    return notices.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
notices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notices.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
notices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notices.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
    const noticesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notices.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
        noticesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notices.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:167
 * @route '/student-portal/notices'
 */
        noticesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notices.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notices.form = noticesForm
const studentPortal = {
    notices: Object.assign(notices, notices),
}

export default studentPortal