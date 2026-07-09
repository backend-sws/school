import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/api.php:113
 * @route '/api/v1/notifications/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/test',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/api.php:113
 * @route '/api/v1/notifications/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:113
 * @route '/api/v1/notifications/test'
 */
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

    /**
 * @see routes/api.php:113
 * @route '/api/v1/notifications/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: test.url(options),
        method: 'post',
    })

            /**
 * @see routes/api.php:113
 * @route '/api/v1/notifications/test'
 */
        testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: test.url(options),
            method: 'post',
        })
    
    test.form = testForm
const notifications = {
    test: Object.assign(test, test),
}

export default notifications