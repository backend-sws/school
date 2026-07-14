import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import hostels from './hostels'
import rooms from './rooms'
import allocations from './allocations'
import complaints from './complaints'
import messPlans from './mess-plans'
/**
 * @see routes/web.php:440
 * @route '/hostel'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hostel',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:440
 * @route '/hostel'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:440
 * @route '/hostel'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:440
 * @route '/hostel'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:440
 * @route '/hostel'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:440
 * @route '/hostel'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:440
 * @route '/hostel'
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
const hostel = {
    index: Object.assign(index, index),
hostels: Object.assign(hostels, hostels),
rooms: Object.assign(rooms, rooms),
allocations: Object.assign(allocations, allocations),
complaints: Object.assign(complaints, complaints),
messPlans: Object.assign(messPlans, messPlans),
}

export default hostel