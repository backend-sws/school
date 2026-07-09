import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import headsC7aea8 from './heads'
import fees from './fees'
import payments4e2b3d from './payments'
/**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
export const feeParticulars = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeParticulars.url(options),
    method: 'get',
})

feeParticulars.definition = {
    methods: ["get","head"],
    url: '/fees/fee-particulars',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
feeParticulars.url = (options?: RouteQueryOptions) => {
    return feeParticulars.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
feeParticulars.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeParticulars.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
feeParticulars.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feeParticulars.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
    const feeParticularsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feeParticulars.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
        feeParticularsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeParticulars.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:227
 * @route '/fees/fee-particulars'
 */
        feeParticularsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeParticulars.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feeParticulars.form = feeParticularsForm
/**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
export const heads = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})

heads.definition = {
    methods: ["get","head"],
    url: '/fees/heads',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
heads.url = (options?: RouteQueryOptions) => {
    return heads.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
heads.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
heads.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: heads.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
    const headsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: heads.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
        headsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: heads.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:228
 * @route '/fees/heads'
 */
        headsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: heads.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    heads.form = headsForm
/**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/fees/payments',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:232
 * @route '/fees/payments'
 */
        paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payments.form = paymentsForm
const feesNamespace = {
    feeParticulars: Object.assign(feeParticulars, feeParticulars),
heads: Object.assign(heads, headsC7aea8),
fees: Object.assign(fees, fees),
payments: Object.assign(payments, payments4e2b3d),
}

export default feesNamespace