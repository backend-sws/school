import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
export const showAccountForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAccountForm.url(options),
    method: 'get',
})

showAccountForm.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
showAccountForm.url = (options?: RouteQueryOptions) => {
    return showAccountForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
showAccountForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAccountForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
showAccountForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showAccountForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
    const showAccountFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showAccountForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
        showAccountFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showAccountForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showAccountForm
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
        showAccountFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showAccountForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showAccountForm.form = showAccountFormForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::storeAccountData
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
export const storeAccountData = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAccountData.url(options),
    method: 'post',
})

storeAccountData.definition = {
    methods: ["post"],
    url: '/onboarding/account',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeAccountData
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
storeAccountData.url = (options?: RouteQueryOptions) => {
    return storeAccountData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeAccountData
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
storeAccountData.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAccountData.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::storeAccountData
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
    const storeAccountDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeAccountData.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::storeAccountData
 * @see app/Http/Controllers/Web/OnboardingController.php:49
 * @route '/onboarding/account'
 */
        storeAccountDataForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeAccountData.url(options),
            method: 'post',
        })
    
    storeAccountData.form = storeAccountDataForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
export const showVerifyNotice = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVerifyNotice.url(options),
    method: 'get',
})

showVerifyNotice.definition = {
    methods: ["get","head"],
    url: '/onboarding/verify-notice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
showVerifyNotice.url = (options?: RouteQueryOptions) => {
    return showVerifyNotice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
showVerifyNotice.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVerifyNotice.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
showVerifyNotice.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVerifyNotice.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
    const showVerifyNoticeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showVerifyNotice.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
        showVerifyNoticeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVerifyNotice.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showVerifyNotice
 * @see app/Http/Controllers/Web/OnboardingController.php:229
 * @route '/onboarding/verify-notice'
 */
        showVerifyNoticeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showVerifyNotice.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showVerifyNotice.form = showVerifyNoticeForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::resendVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
export const resendVerification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerification.url(options),
    method: 'post',
})

resendVerification.definition = {
    methods: ["post"],
    url: '/onboarding/resend-verification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::resendVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
resendVerification.url = (options?: RouteQueryOptions) => {
    return resendVerification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::resendVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
resendVerification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerification.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::resendVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
    const resendVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resendVerification.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::resendVerification
 * @see app/Http/Controllers/Web/OnboardingController.php:339
 * @route '/onboarding/resend-verification'
 */
        resendVerificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resendVerification.url(options),
            method: 'post',
        })
    
    resendVerification.form = resendVerificationForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
export const checkVerificationStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVerificationStatus.url(options),
    method: 'get',
})

checkVerificationStatus.definition = {
    methods: ["get","head"],
    url: '/onboarding/check-verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerificationStatus.url = (options?: RouteQueryOptions) => {
    return checkVerificationStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerificationStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkVerificationStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
checkVerificationStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkVerificationStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
    const checkVerificationStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkVerificationStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
        checkVerificationStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVerificationStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::checkVerificationStatus
 * @see app/Http/Controllers/Web/OnboardingController.php:277
 * @route '/onboarding/check-verification'
 */
        checkVerificationStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkVerificationStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkVerificationStatus.form = checkVerificationStatusForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
export const verifyEmail = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyEmail.url(args, options),
    method: 'get',
})

verifyEmail.definition = {
    methods: ["get","head"],
    url: '/onboarding/verify/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verifyEmail.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyEmail.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verifyEmail.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyEmail.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
verifyEmail.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyEmail.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
    const verifyEmailForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verifyEmail.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
        verifyEmailForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyEmail.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::verifyEmail
 * @see app/Http/Controllers/Web/OnboardingController.php:300
 * @route '/onboarding/verify/{token}'
 */
        verifyEmailForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyEmail.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verifyEmail.form = verifyEmailForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
export const showPlanSelection = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPlanSelection.url(options),
    method: 'get',
})

showPlanSelection.definition = {
    methods: ["get","head"],
    url: '/onboarding/plan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
showPlanSelection.url = (options?: RouteQueryOptions) => {
    return showPlanSelection.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
showPlanSelection.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPlanSelection.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
showPlanSelection.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPlanSelection.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
    const showPlanSelectionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showPlanSelection.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
        showPlanSelectionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPlanSelection.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:392
 * @route '/onboarding/plan'
 */
        showPlanSelectionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPlanSelection.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showPlanSelection.form = showPlanSelectionForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::storePlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:144
 * @route '/onboarding/plan'
 */
export const storePlanSelection = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePlanSelection.url(options),
    method: 'post',
})

storePlanSelection.definition = {
    methods: ["post"],
    url: '/onboarding/plan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::storePlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:144
 * @route '/onboarding/plan'
 */
storePlanSelection.url = (options?: RouteQueryOptions) => {
    return storePlanSelection.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::storePlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:144
 * @route '/onboarding/plan'
 */
storePlanSelection.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePlanSelection.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::storePlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:144
 * @route '/onboarding/plan'
 */
    const storePlanSelectionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePlanSelection.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::storePlanSelection
 * @see app/Http/Controllers/Web/OnboardingController.php:144
 * @route '/onboarding/plan'
 */
        storePlanSelectionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePlanSelection.url(options),
            method: 'post',
        })
    
    storePlanSelection.form = storePlanSelectionForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
export const showCardDetails = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCardDetails.url(options),
    method: 'get',
})

showCardDetails.definition = {
    methods: ["get","head"],
    url: '/onboarding/card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
showCardDetails.url = (options?: RouteQueryOptions) => {
    return showCardDetails.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
showCardDetails.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCardDetails.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
showCardDetails.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showCardDetails.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
    const showCardDetailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showCardDetails.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
        showCardDetailsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showCardDetails.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:161
 * @route '/onboarding/card'
 */
        showCardDetailsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showCardDetails.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showCardDetails.form = showCardDetailsForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::storeCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:169
 * @route '/onboarding/card'
 */
export const storeCardDetails = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCardDetails.url(options),
    method: 'post',
})

storeCardDetails.definition = {
    methods: ["post"],
    url: '/onboarding/card',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:169
 * @route '/onboarding/card'
 */
storeCardDetails.url = (options?: RouteQueryOptions) => {
    return storeCardDetails.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:169
 * @route '/onboarding/card'
 */
storeCardDetails.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCardDetails.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::storeCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:169
 * @route '/onboarding/card'
 */
    const storeCardDetailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCardDetails.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::storeCardDetails
 * @see app/Http/Controllers/Web/OnboardingController.php:169
 * @route '/onboarding/card'
 */
        storeCardDetailsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCardDetails.url(options),
            method: 'post',
        })
    
    storeCardDetails.form = storeCardDetailsForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
export const showOrgSetup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showOrgSetup.url(options),
    method: 'get',
})

showOrgSetup.definition = {
    methods: ["get","head"],
    url: '/onboarding/setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
showOrgSetup.url = (options?: RouteQueryOptions) => {
    return showOrgSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
showOrgSetup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showOrgSetup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
showOrgSetup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showOrgSetup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
    const showOrgSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showOrgSetup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
        showOrgSetupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showOrgSetup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:213
 * @route '/onboarding/setup'
 */
        showOrgSetupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showOrgSetup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showOrgSetup.form = showOrgSetupForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::storeOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
export const storeOrgSetup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrgSetup.url(options),
    method: 'post',
})

storeOrgSetup.definition = {
    methods: ["post"],
    url: '/onboarding/setup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
storeOrgSetup.url = (options?: RouteQueryOptions) => {
    return storeOrgSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::storeOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
storeOrgSetup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrgSetup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::storeOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
    const storeOrgSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeOrgSetup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::storeOrgSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:424
 * @route '/onboarding/setup'
 */
        storeOrgSetupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeOrgSetup.url(options),
            method: 'post',
        })
    
    storeOrgSetup.form = storeOrgSetupForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
export const showDataImport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showDataImport.url(options),
    method: 'get',
})

showDataImport.definition = {
    methods: ["get","head"],
    url: '/onboarding/data-import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
showDataImport.url = (options?: RouteQueryOptions) => {
    return showDataImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
showDataImport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showDataImport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
showDataImport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showDataImport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
    const showDataImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showDataImport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
        showDataImportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showDataImport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showDataImport
 * @see app/Http/Controllers/Web/OnboardingController.php:468
 * @route '/onboarding/data-import'
 */
        showDataImportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showDataImport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showDataImport.form = showDataImportForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::autoSeedCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:489
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
export const autoSeedCategory = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSeedCategory.url(args, options),
    method: 'post',
})

autoSeedCategory.definition = {
    methods: ["post"],
    url: '/onboarding/data-import/auto-seed/{category}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::autoSeedCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:489
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
autoSeedCategory.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return autoSeedCategory.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::autoSeedCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:489
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
autoSeedCategory.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSeedCategory.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::autoSeedCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:489
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
    const autoSeedCategoryForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoSeedCategory.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::autoSeedCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:489
 * @route '/onboarding/data-import/auto-seed/{category}'
 */
        autoSeedCategoryForm.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoSeedCategory.url(args, options),
            method: 'post',
        })
    
    autoSeedCategory.form = autoSeedCategoryForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::uploadCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:509
 * @route '/onboarding/data-import/upload/{category}'
 */
export const uploadCategory = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCategory.url(args, options),
    method: 'post',
})

uploadCategory.definition = {
    methods: ["post"],
    url: '/onboarding/data-import/upload/{category}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::uploadCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:509
 * @route '/onboarding/data-import/upload/{category}'
 */
uploadCategory.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return uploadCategory.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::uploadCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:509
 * @route '/onboarding/data-import/upload/{category}'
 */
uploadCategory.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCategory.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::uploadCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:509
 * @route '/onboarding/data-import/upload/{category}'
 */
    const uploadCategoryForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadCategory.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::uploadCategory
 * @see app/Http/Controllers/Web/OnboardingController.php:509
 * @route '/onboarding/data-import/upload/{category}'
 */
        uploadCategoryForm.post = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadCategory.url(args, options),
            method: 'post',
        })
    
    uploadCategory.form = uploadCategoryForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
export const downloadSampleTemplate = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSampleTemplate.url(args, options),
    method: 'get',
})

downloadSampleTemplate.definition = {
    methods: ["get","head"],
    url: '/onboarding/data-import/template/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
downloadSampleTemplate.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return downloadSampleTemplate.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
downloadSampleTemplate.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSampleTemplate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
downloadSampleTemplate.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadSampleTemplate.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
    const downloadSampleTemplateForm = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadSampleTemplate.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
        downloadSampleTemplateForm.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadSampleTemplate.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::downloadSampleTemplate
 * @see app/Http/Controllers/Web/OnboardingController.php:521
 * @route '/onboarding/data-import/template/{category}'
 */
        downloadSampleTemplateForm.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadSampleTemplate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadSampleTemplate.form = downloadSampleTemplateForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
export const showPlatformSetup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPlatformSetup.url(options),
    method: 'get',
})

showPlatformSetup.definition = {
    methods: ["get","head"],
    url: '/onboarding/platform-setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
showPlatformSetup.url = (options?: RouteQueryOptions) => {
    return showPlatformSetup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
showPlatformSetup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPlatformSetup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
showPlatformSetup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPlatformSetup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
    const showPlatformSetupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showPlatformSetup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
        showPlatformSetupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPlatformSetup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::showPlatformSetup
 * @see app/Http/Controllers/Web/OnboardingController.php:569
 * @route '/onboarding/platform-setup'
 */
        showPlatformSetupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPlatformSetup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showPlatformSetup.form = showPlatformSetupForm
const OnboardingController = { showAccountForm, storeAccountData, showVerifyNotice, resendVerification, checkVerificationStatus, verifyEmail, showPlanSelection, storePlanSelection, showCardDetails, storeCardDetails, showOrgSetup, storeOrgSetup, showDataImport, autoSeedCategory, uploadCategory, downloadSampleTemplate, showPlatformSetup }

export default OnboardingController