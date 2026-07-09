import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::seed
 * @see app/Http/Controllers/Web/OnboardingController.php:481
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
export const seed = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: seed.url(args, options),
    method: 'post',
})

seed.definition = {
    methods: ["post"],
    url: '/onboarding/data-import/auto-seed/{category}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::seed
 * @see app/Http/Controllers/Web/OnboardingController.php:481
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
seed.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return seed.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::seed
 * @see app/Http/Controllers/Web/OnboardingController.php:481
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
seed.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: seed.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::seed
 * @see app/Http/Controllers/Web/OnboardingController.php:481
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
    const seedForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: seed.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::seed
 * @see app/Http/Controllers/Web/OnboardingController.php:481
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
        seedForm.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: seed.url(args, options),
            method: 'post',
        })
    
    seed.form = seedForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::upload
 * @see app/Http/Controllers/Web/OnboardingController.php:501
 * @route '/onboarding/data-import/upload/{category}'
 */
export const upload = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/onboarding/data-import/upload/{category}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::upload
 * @see app/Http/Controllers/Web/OnboardingController.php:501
 * @route '/onboarding/data-import/upload/{category}'
 */
upload.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return upload.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::upload
 * @see app/Http/Controllers/Web/OnboardingController.php:501
 * @route '/onboarding/data-import/upload/{category}'
 */
upload.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::upload
 * @see app/Http/Controllers/Web/OnboardingController.php:501
 * @route '/onboarding/data-import/upload/{category}'
 */
    const uploadForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::upload
 * @see app/Http/Controllers/Web/OnboardingController.php:501
 * @route '/onboarding/data-import/upload/{category}'
 */
        uploadForm.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
export const template = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(args, options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/onboarding/data-import/template/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
template.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return template.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
template.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
template.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
    const templateForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: template.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
        templateForm.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::template
 * @see app/Http/Controllers/Web/OnboardingController.php:513
 * @route '/onboarding/data-import/template/{category}'
 */
        templateForm.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    template.form = templateForm
const dataImport = {
    seed: Object.assign(seed, seed),
upload: Object.assign(upload, upload),
template: Object.assign(template, template),
}

export default dataImport