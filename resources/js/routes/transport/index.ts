import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import stops from './stops'
import routes from './routes'
import vehicles from './vehicles'
import drivers from './drivers'
import assignments from './assignments'
import reports from './reports'
/**
 * @see routes/web.php:427
 * @route '/transport'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transport',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:427
 * @route '/transport'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:427
 * @route '/transport'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:427
 * @route '/transport'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:427
 * @route '/transport'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:427
 * @route '/transport'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:427
 * @route '/transport'
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
const transport = {
    index: Object.assign(index, index),
stops: Object.assign(stops, stops),
routes: Object.assign(routes, routes),
vehicles: Object.assign(vehicles, vehicles),
drivers: Object.assign(drivers, drivers),
assignments: Object.assign(assignments, assignments),
reports: Object.assign(reports, reports),
}

export default transport