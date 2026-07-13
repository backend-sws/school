import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
export const showGrid = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showGrid.url(args, options),
    method: 'get',
})

showGrid.definition = {
    methods: ["get","head"],
    url: '/examination/schedules/{schedule}/marks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
showGrid.url = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { schedule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    schedule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        schedule: typeof args.schedule === 'object'
                ? args.schedule.id
                : args.schedule,
                }

    return showGrid.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
showGrid.get = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showGrid.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
showGrid.head = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showGrid.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
    const showGridForm = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showGrid.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
        showGridForm.get = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showGrid.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::showGrid
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
        showGridForm.head = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showGrid.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showGrid.form = showGridForm
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::saveBatch
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
export const saveBatch = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveBatch.url(args, options),
    method: 'post',
})

saveBatch.definition = {
    methods: ["post"],
    url: '/examination/schedules/{schedule}/marks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::saveBatch
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
saveBatch.url = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schedule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { schedule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    schedule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        schedule: typeof args.schedule === 'object'
                ? args.schedule.id
                : args.schedule,
                }

    return saveBatch.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::saveBatch
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
saveBatch.post = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveBatch.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\MarksEntryController::saveBatch
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
    const saveBatchForm = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveBatch.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::saveBatch
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
        saveBatchForm.post = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveBatch.url(args, options),
            method: 'post',
        })
    
    saveBatch.form = saveBatchForm
const MarksEntryController = { showGrid, saveBatch }

export default MarksEntryController