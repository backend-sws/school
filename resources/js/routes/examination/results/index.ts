import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/examination/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
    const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
        listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamResultController::list
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
        listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    list.form = listForm
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
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
    const indexForm = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
        indexForm.get = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
        indexForm.head = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
 * @see app/Http/Controllers/Examination/ExamResultController.php:112
 * @route '/examination/exams/{exam}/results/print-summary'
 */
    const printSummaryForm = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: printSummary.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
 * @see app/Http/Controllers/Examination/ExamResultController.php:112
 * @route '/examination/exams/{exam}/results/print-summary'
 */
        printSummaryForm.post = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: printSummary.url(args, options),
            method: 'post',
        })
    
    printSummary.form = printSummaryForm
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

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
 * @see app/Http/Controllers/Examination/ExamResultController.php:154
 * @route '/examination/exams/{exam}/results/print-broadsheet'
 */
    const printBroadsheetForm = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: printBroadsheet.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
 * @see app/Http/Controllers/Examination/ExamResultController.php:154
 * @route '/examination/exams/{exam}/results/print-broadsheet'
 */
        printBroadsheetForm.post = (args: { exam: number | { id: number } } | [exam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: printBroadsheet.url(args, options),
            method: 'post',
        })
    
    printBroadsheet.form = printBroadsheetForm
const results = {
    list: Object.assign(list, list),
index: Object.assign(index, index),
printSummary: Object.assign(printSummary, printSummary),
printBroadsheet: Object.assign(printBroadsheet, printBroadsheet),
}

export default results