import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination/admit-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::index
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:42
 * @route '/examination/admit-cards'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
export const bulkPrint = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrint.url(options),
    method: 'get',
})

bulkPrint.definition = {
    methods: ["get","post","head"],
    url: '/examination/admit-cards/bulk-print',
} satisfies RouteDefinition<["get","post","head"]>

/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
bulkPrint.url = (options?: RouteQueryOptions) => {
    return bulkPrint.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
bulkPrint.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrint.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
bulkPrint.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPrint.url(options),
    method: 'post',
})
/**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
bulkPrint.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPrint.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
    const bulkPrintForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulkPrint.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
        bulkPrintForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkPrint.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
        bulkPrintForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkPrint.url(options),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Examination\ExamAdmitCardController::bulkPrint
 * @see app/Http/Controllers/Examination/ExamAdmitCardController.php:154
 * @route '/examination/admit-cards/bulk-print'
 */
        bulkPrintForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkPrint.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bulkPrint.form = bulkPrintForm
const ExamAdmitCardController = { index, bulkPrint }

export default ExamAdmitCardController