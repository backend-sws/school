import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
 * @route '/api/v1/fees/ad-hoc-charges'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/fees/ad-hoc-charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
 * @route '/api/v1/fees/ad-hoc-charges'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
 * @route '/api/v1/fees/ad-hoc-charges'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
 * @route '/api/v1/fees/ad-hoc-charges'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Fees\AdHocChargeController::store
 * @see app/Http/Controllers/Api/V1/Fees/AdHocChargeController.php:15
 * @route '/api/v1/fees/ad-hoc-charges'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const AdHocChargeController = { store }

export default AdHocChargeController