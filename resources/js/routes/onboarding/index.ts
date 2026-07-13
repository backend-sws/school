import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import account from './account'
import planB10180 from './plan'
import cardE7bbe9 from './card'
import setup90f0be from './setup'
import dataImport8a61c1 from './data-import'
/**
* @see \App\Http\Controllers\Web\OnboardingController::resend
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/onboarding/resend-verification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::resend
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::resend
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::resend
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
    const resendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resend.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::resend
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
        resendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resend.url(options),
            method: 'post',
        })
    
    resend.form = resendForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
export const checkVerification = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVerification.url(options),
    method: 'get',
})

checkVerification.definition = {
    methods: ["get","head"],
    url: '/onboarding/check-verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerification.url = (options?: RouteQueryOptions) => {
    return checkVerification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerification.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVerification.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerification.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkVerification.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
    const checkVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkVerification.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
        checkVerificationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVerification.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
        checkVerificationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVerification.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkVerification.form = checkVerificationForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
export const verify = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/onboarding/verify/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verify.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return verify.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verify.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verify.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
    const verifyForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verify.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
        verifyForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::verify
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
        verifyForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
export const plan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plan.url(options),
    method: 'get',
})

plan.definition = {
    methods: ["get","head"],
    url: '/onboarding/plan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
plan.url = (options?: RouteQueryOptions) => {
    return plan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
plan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
plan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
    const planForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: plan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
        planForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::plan
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
        planForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    plan.form = planForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
export const card = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: card.url(options),
    method: 'get',
})

card.definition = {
    methods: ["get","head"],
    url: '/onboarding/card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
card.url = (options?: RouteQueryOptions) => {
    return card.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
card.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: card.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
card.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: card.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
    const cardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: card.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
        cardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: card.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::card
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
        cardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: card.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    card.form = cardForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
export const setup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
})

setup.definition = {
    methods: ["get","head"],
    url: '/onboarding/setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
setup.url = (options?: RouteQueryOptions) => {
    return setup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
setup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
setup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: setup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
    const setupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: setup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
        setupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::setup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
        setupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: setup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    setup.form = setupForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
export const dataImport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataImport.url(options),
    method: 'get',
})

dataImport.definition = {
    methods: ["get","head"],
    url: '/onboarding/data-import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
dataImport.url = (options?: RouteQueryOptions) => {
    return dataImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
dataImport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dataImport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
dataImport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dataImport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
    const dataImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dataImport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
        dataImportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dataImport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::dataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
        dataImportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dataImport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dataImport.form = dataImportForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
export const platformSetup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: platformSetup.url(options),
    method: 'get',
})

platformSetup.definition = {
    methods: ["get","head"],
    url: '/onboarding/platform-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
platformSetup.url = (options?: RouteQueryOptions) => {
    return platformSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
platformSetup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: platformSetup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
platformSetup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: platformSetup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
    const platformSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: platformSetup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
        platformSetupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: platformSetup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::platformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
        platformSetupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: platformSetup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    platformSetup.form = platformSetupForm
const onboarding = {
    account: Object.assign(account, account),
verify: Object.assign(verify, verify),
resend: Object.assign(resend, resend),
checkVerification: Object.assign(checkVerification, checkVerification),
plan: Object.assign(plan, planB10180),
card: Object.assign(card, cardE7bbe9),
setup: Object.assign(setup, setup90f0be),
dataImport: Object.assign(dataImport, dataImport8a61c1),
platformSetup: Object.assign(platformSetup, platformSetup),
}

export default onboarding