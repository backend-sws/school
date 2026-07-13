import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
const marksheets = {
    bulkPrint: Object.assign(bulkPrint, bulkPrint),
}

export default marksheets