import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Examination\MarksheetController::studentView
* @see app/Http/Controllers/Examination/MarksheetController.php:38
* @route '/student-portal/exams/{exam}/marksheet'
*/
export const studentView = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentView.url(args, options),
    method: 'get',
})

studentView.definition = {
    methods: ["get","head"],
    url: '/student-portal/exams/{exam}/marksheet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentView
* @see app/Http/Controllers/Examination/MarksheetController.php:38
* @route '/student-portal/exams/{exam}/marksheet'
*/
studentView.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { exam: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            exam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        exam: typeof args.exam === 'object'
        ? args.exam.id
        : args.exam,
    }

    return studentView.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentView
* @see app/Http/Controllers/Examination/MarksheetController.php:38
* @route '/student-portal/exams/{exam}/marksheet'
*/
studentView.get = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentView.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentView
* @see app/Http/Controllers/Examination/MarksheetController.php:38
* @route '/student-portal/exams/{exam}/marksheet'
*/
studentView.head = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentView.url(args, options),
    method: 'head',
})

const MarksheetController = { show, studentView }

export default MarksheetController