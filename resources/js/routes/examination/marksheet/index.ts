import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
export const show = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/examination/exams/{exam}/marksheet/{student}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
show.url = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    exam: args[0],
                    student: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exam: typeof args.exam === 'object'
                ? args.exam.id
                : args.exam,
                                student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return show.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
show.get = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
show.head = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
    const showForm = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
        showForm.get = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\MarksheetController::show
 * @see app/Http/Controllers/Examination/MarksheetController.php:24
 * @route '/examination/exams/{exam}/marksheet/{student}'
 */
        showForm.head = (args: { exam: number | { id: number }, student: number | { id: number } } | [exam: number | { id: number }, student: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const marksheet = {
    show: Object.assign(show, show),
}

export default marksheet