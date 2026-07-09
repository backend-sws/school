import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
* @see app/Http/Controllers/Examination/ExamResultController.php:26
* @route '/examination/results'
*/
export const listExams = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listExams.url(options),
    method: 'get',
})

listExams.definition = {
    methods: ["get","head"],
    url: '/examination/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
* @see app/Http/Controllers/Examination/ExamResultController.php:26
* @route '/examination/results'
*/
listExams.url = (options?: RouteQueryOptions) => {
    return listExams.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
* @see app/Http/Controllers/Examination/ExamResultController.php:26
* @route '/examination/results'
*/
listExams.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listExams.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
* @see app/Http/Controllers/Examination/ExamResultController.php:26
* @route '/examination/results'
*/
listExams.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listExams.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
* @see app/Http/Controllers/Examination/ExamResultController.php:35
* @route '/examination/exams/{exam}/results'
*/
export const index = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination/exams/{exam}/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
* @see app/Http/Controllers/Examination/ExamResultController.php:35
* @route '/examination/exams/{exam}/results'
*/
index.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
* @see app/Http/Controllers/Examination/ExamResultController.php:35
* @route '/examination/exams/{exam}/results'
*/
index.get = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
* @see app/Http/Controllers/Examination/ExamResultController.php:35
* @route '/examination/exams/{exam}/results'
*/
index.head = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
* @see app/Http/Controllers/Examination/ExamResultController.php:84
* @route '/examination/exams/{exam}/marksheets/bulk-print'
*/
export const bulkPrint = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPrint.url(args, options),
    method: 'post',
})

bulkPrint.definition = {
    methods: ["post"],
    url: '/examination/exams/{exam}/marksheets/bulk-print',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
* @see app/Http/Controllers/Examination/ExamResultController.php:84
* @route '/examination/exams/{exam}/marksheets/bulk-print'
*/
bulkPrint.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return bulkPrint.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
* @see app/Http/Controllers/Examination/ExamResultController.php:84
* @route '/examination/exams/{exam}/marksheets/bulk-print'
*/
bulkPrint.post = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPrint.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
* @see app/Http/Controllers/Examination/ExamResultController.php:112
* @route '/examination/exams/{exam}/results/print-summary'
*/
export const printSummary = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printSummary.url(args, options),
    method: 'post',
})

printSummary.definition = {
    methods: ["post"],
    url: '/examination/exams/{exam}/results/print-summary',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
* @see app/Http/Controllers/Examination/ExamResultController.php:112
* @route '/examination/exams/{exam}/results/print-summary'
*/
printSummary.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return printSummary.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
* @see app/Http/Controllers/Examination/ExamResultController.php:112
* @route '/examination/exams/{exam}/results/print-summary'
*/
printSummary.post = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printSummary.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
* @see app/Http/Controllers/Examination/ExamResultController.php:154
* @route '/examination/exams/{exam}/results/print-broadsheet'
*/
export const printBroadsheet = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printBroadsheet.url(args, options),
    method: 'post',
})

printBroadsheet.definition = {
    methods: ["post"],
    url: '/examination/exams/{exam}/results/print-broadsheet',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
* @see app/Http/Controllers/Examination/ExamResultController.php:154
* @route '/examination/exams/{exam}/results/print-broadsheet'
*/
printBroadsheet.url = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return printBroadsheet.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
* @see app/Http/Controllers/Examination/ExamResultController.php:154
* @route '/examination/exams/{exam}/results/print-broadsheet'
*/
printBroadsheet.post = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printBroadsheet.url(args, options),
    method: 'post',
})

const ExamResultController = { listExams, index, bulkPrint, printSummary, printBroadsheet }

export default ExamResultController