import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
    const listExamsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listExams.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
        listExamsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listExams.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamResultController::listExams
 * @see app/Http/Controllers/Examination/ExamResultController.php:26
 * @route '/examination/results'
 */
        listExamsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listExams.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listExams.form = listExamsForm
/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
export const index = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
index.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
index.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
index.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
    const indexForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
        indexForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamResultController::index
 * @see app/Http/Controllers/Examination/ExamResultController.php:35
 * @route '/examination/exams/{exam}/results'
 */
        indexForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamResultController.php:84
 * @route '/examination/exams/{exam}/marksheets/bulk-print'
 */
export const bulkPrint = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
bulkPrint.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
bulkPrint.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPrint.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamResultController.php:84
 * @route '/examination/exams/{exam}/marksheets/bulk-print'
 */
    const bulkPrintForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkPrint.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamResultController.php:84
 * @route '/examination/exams/{exam}/marksheets/bulk-print'
 */
        bulkPrintForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkPrint.url(args, options),
            method: 'post',
        })
    
    bulkPrint.form = bulkPrintForm
/**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
 * @see app/Http/Controllers/Examination/ExamResultController.php:112
 * @route '/examination/exams/{exam}/results/print-summary'
 */
export const printSummary = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
printSummary.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
printSummary.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printSummary.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
 * @see app/Http/Controllers/Examination/ExamResultController.php:112
 * @route '/examination/exams/{exam}/results/print-summary'
 */
    const printSummaryForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: printSummary.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::printSummary
 * @see app/Http/Controllers/Examination/ExamResultController.php:112
 * @route '/examination/exams/{exam}/results/print-summary'
 */
        printSummaryForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: printSummary.url(args, options),
            method: 'post',
        })
    
    printSummary.form = printSummaryForm
/**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
 * @see app/Http/Controllers/Examination/ExamResultController.php:154
 * @route '/examination/exams/{exam}/results/print-broadsheet'
 */
export const printBroadsheet = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
printBroadsheet.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
printBroadsheet.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: printBroadsheet.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
 * @see app/Http/Controllers/Examination/ExamResultController.php:154
 * @route '/examination/exams/{exam}/results/print-broadsheet'
 */
    const printBroadsheetForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: printBroadsheet.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamResultController::printBroadsheet
 * @see app/Http/Controllers/Examination/ExamResultController.php:154
 * @route '/examination/exams/{exam}/results/print-broadsheet'
 */
        printBroadsheetForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: printBroadsheet.url(args, options),
            method: 'post',
        })
    
    printBroadsheet.form = printBroadsheetForm
const ExamResultController = { listExams, index, bulkPrint, printSummary, printBroadsheet }

export default ExamResultController