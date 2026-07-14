import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import reports from './reports'
/**
 * @see routes/web.php:469
 * @route '/attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:469
 * @route '/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:469
 * @route '/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:469
 * @route '/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:469
 * @route '/attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:469
 * @route '/attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:469
 * @route '/attendance'
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
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
export const mark = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mark.url(options),
    method: 'get',
})

mark.definition = {
    methods: ["get","head"],
    url: '/attendance/mark',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
mark.url = (options?: RouteQueryOptions) => {
    return mark.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
mark.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mark.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
mark.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mark.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
    const markForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mark.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
        markForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mark.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:470
 * @route '/attendance/mark'
 */
        markForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mark.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mark.form = markForm
const attendance = {
    index: Object.assign(index, index),
mark: Object.assign(mark, mark),
reports: Object.assign(reports, reports),
}

export default attendance