import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
const ShortUrlController = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ShortUrlController.url(args, options),
    method: 'get',
})

ShortUrlController.definition = {
    methods: ["get","head"],
    url: '/{code}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
ShortUrlController.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        code: args.code,
                }

    return ShortUrlController.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
ShortUrlController.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ShortUrlController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
ShortUrlController.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ShortUrlController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
    const ShortUrlControllerForm = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ShortUrlController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
        ShortUrlControllerForm.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ShortUrlController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ShortUrlController::__invoke
 * @see app/Http/Controllers/ShortUrlController.php:14
 * @route '/{code}'
 */
        ShortUrlControllerForm.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ShortUrlController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ShortUrlController.form = ShortUrlControllerForm
export default ShortUrlController