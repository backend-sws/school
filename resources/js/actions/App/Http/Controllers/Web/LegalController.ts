import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
const show619dc3a99425f668ea9cab64e6648cb4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
})

show619dc3a99425f668ea9cab64e6648cb4.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
show619dc3a99425f668ea9cab64e6648cb4.url = (options?: RouteQueryOptions) => {
    return show619dc3a99425f668ea9cab64e6648cb4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
show619dc3a99425f668ea9cab64e6648cb4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
show619dc3a99425f668ea9cab64e6648cb4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
    const show619dc3a99425f668ea9cab64e6648cb4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show619dc3a99425f668ea9cab64e6648cb4.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
        show619dc3a99425f668ea9cab64e6648cb4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show619dc3a99425f668ea9cab64e6648cb4.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/terms'
 */
        show619dc3a99425f668ea9cab64e6648cb4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show619dc3a99425f668ea9cab64e6648cb4.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show619dc3a99425f668ea9cab64e6648cb4.form = show619dc3a99425f668ea9cab64e6648cb4Form
    /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
const showa2c058616aeb0c9393ca03a98bc05c02 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2c058616aeb0c9393ca03a98bc05c02.url(options),
    method: 'get',
})

showa2c058616aeb0c9393ca03a98bc05c02.definition = {
    methods: ["get","head"],
    url: '/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
showa2c058616aeb0c9393ca03a98bc05c02.url = (options?: RouteQueryOptions) => {
    return showa2c058616aeb0c9393ca03a98bc05c02.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
showa2c058616aeb0c9393ca03a98bc05c02.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2c058616aeb0c9393ca03a98bc05c02.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
showa2c058616aeb0c9393ca03a98bc05c02.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showa2c058616aeb0c9393ca03a98bc05c02.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
    const showa2c058616aeb0c9393ca03a98bc05c02Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showa2c058616aeb0c9393ca03a98bc05c02.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
        showa2c058616aeb0c9393ca03a98bc05c02Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showa2c058616aeb0c9393ca03a98bc05c02.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\LegalController::show
 * @see app/Http/Controllers/Web/LegalController.php:26
 * @route '/privacy'
 */
        showa2c058616aeb0c9393ca03a98bc05c02Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showa2c058616aeb0c9393ca03a98bc05c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showa2c058616aeb0c9393ca03a98bc05c02.form = showa2c058616aeb0c9393ca03a98bc05c02Form

/**
* Multiple routes resolve to \App\Http\Controllers\Web\LegalController::show, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `show['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const show = {
    '/terms': show619dc3a99425f668ea9cab64e6648cb4,
    '/privacy': showa2c058616aeb0c9393ca03a98bc05c02,
}

const LegalController = { show }

export default LegalController