import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
export const show = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/examination/schedules/{schedule}/marks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
show.url = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
show.get = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
show.head = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
    const showForm = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
        showForm.get = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::show
 * @see app/Http/Controllers/Examination/MarksEntryController.php:18
 * @route '/examination/schedules/{schedule}/marks'
 */
        showForm.head = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Examination\MarksEntryController::save
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
export const save = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/examination/schedules/{schedule}/marks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::save
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
save.url = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return save.definition.url
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksEntryController::save
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
save.post = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\MarksEntryController::save
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
    const saveForm = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: save.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksEntryController::save
 * @see app/Http/Controllers/Examination/MarksEntryController.php:55
 * @route '/examination/schedules/{schedule}/marks'
 */
        saveForm.post = (args: { schedule: string | number | { id: string | number } } | [schedule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: save.url(args, options),
            method: 'post',
        })
    
    save.form = saveForm
const marksEntry = {
    show: Object.assign(show, show),
save: Object.assign(save, save),
}

export default marksEntry