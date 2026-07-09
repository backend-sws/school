import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:24
 * @route '/api/v1/webhooks/sms/msg91'
 */
export const msg91 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: msg91.url(options),
    method: 'post',
})

msg91.definition = {
    methods: ["post"],
    url: '/api/v1/webhooks/sms/msg91',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:24
 * @route '/api/v1/webhooks/sms/msg91'
 */
msg91.url = (options?: RouteQueryOptions) => {
    return msg91.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:24
 * @route '/api/v1/webhooks/sms/msg91'
 */
msg91.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: msg91.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:24
 * @route '/api/v1/webhooks/sms/msg91'
 */
    const msg91Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: msg91.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:24
 * @route '/api/v1/webhooks/sms/msg91'
 */
        msg91Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: msg91.url(options),
            method: 'post',
        })
    
    msg91.form = msg91Form
/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91Whatsapp
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:79
 * @route '/api/v1/webhooks/sms/msg91-whatsapp'
 */
export const msg91Whatsapp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: msg91Whatsapp.url(options),
    method: 'post',
})

msg91Whatsapp.definition = {
    methods: ["post"],
    url: '/api/v1/webhooks/sms/msg91-whatsapp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91Whatsapp
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:79
 * @route '/api/v1/webhooks/sms/msg91-whatsapp'
 */
msg91Whatsapp.url = (options?: RouteQueryOptions) => {
    return msg91Whatsapp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91Whatsapp
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:79
 * @route '/api/v1/webhooks/sms/msg91-whatsapp'
 */
msg91Whatsapp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: msg91Whatsapp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91Whatsapp
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:79
 * @route '/api/v1/webhooks/sms/msg91-whatsapp'
 */
    const msg91WhatsappForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: msg91Whatsapp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Communications\SmsWebhookController::msg91Whatsapp
 * @see app/Http/Controllers/Api/V1/Communications/SmsWebhookController.php:79
 * @route '/api/v1/webhooks/sms/msg91-whatsapp'
 */
        msg91WhatsappForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: msg91Whatsapp.url(options),
            method: 'post',
        })
    
    msg91Whatsapp.form = msg91WhatsappForm
const SmsWebhookController = { msg91, msg91Whatsapp }

export default SmsWebhookController