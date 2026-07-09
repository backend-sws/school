import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::login
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:188
 * @route '/api/v1/auth/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/v1/auth/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::login
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:188
 * @route '/api/v1/auth/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::login
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:188
 * @route '/api/v1/auth/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::login
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:188
 * @route '/api/v1/auth/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::login
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:188
 * @route '/api/v1/auth/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::register
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:241
 * @route '/api/v1/auth/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/api/v1/auth/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::register
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:241
 * @route '/api/v1/auth/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::register
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:241
 * @route '/api/v1/auth/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::register
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:241
 * @route '/api/v1/auth/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::register
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:241
 * @route '/api/v1/auth/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::requestOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:74
 * @route '/api/v1/auth/request-otp-login'
 */
export const requestOtpLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestOtpLogin.url(options),
    method: 'post',
})

requestOtpLogin.definition = {
    methods: ["post"],
    url: '/api/v1/auth/request-otp-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::requestOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:74
 * @route '/api/v1/auth/request-otp-login'
 */
requestOtpLogin.url = (options?: RouteQueryOptions) => {
    return requestOtpLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::requestOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:74
 * @route '/api/v1/auth/request-otp-login'
 */
requestOtpLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestOtpLogin.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::requestOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:74
 * @route '/api/v1/auth/request-otp-login'
 */
    const requestOtpLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: requestOtpLogin.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::requestOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:74
 * @route '/api/v1/auth/request-otp-login'
 */
        requestOtpLoginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: requestOtpLogin.url(options),
            method: 'post',
        })
    
    requestOtpLogin.form = requestOtpLoginForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:0
 * @route '/api/v1/auth/verify-otp-login'
 */
export const verifyOtpLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpLogin.url(options),
    method: 'post',
})

verifyOtpLogin.definition = {
    methods: ["post"],
    url: '/api/v1/auth/verify-otp-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:0
 * @route '/api/v1/auth/verify-otp-login'
 */
verifyOtpLogin.url = (options?: RouteQueryOptions) => {
    return verifyOtpLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:0
 * @route '/api/v1/auth/verify-otp-login'
 */
verifyOtpLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpLogin.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:0
 * @route '/api/v1/auth/verify-otp-login'
 */
    const verifyOtpLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtpLogin.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpLogin
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:0
 * @route '/api/v1/auth/verify-otp-login'
 */
        verifyOtpLoginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtpLogin.url(options),
            method: 'post',
        })
    
    verifyOtpLogin.form = verifyOtpLoginForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtp
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:302
 * @route '/api/v1/auth/verify-otp'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/api/v1/auth/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtp
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:302
 * @route '/api/v1/auth/verify-otp'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtp
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:302
 * @route '/api/v1/auth/verify-otp'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtp
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:302
 * @route '/api/v1/auth/verify-otp'
 */
    const verifyOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtp
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:302
 * @route '/api/v1/auth/verify-otp'
 */
        verifyOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtp.url(options),
            method: 'post',
        })
    
    verifyOtp.form = verifyOtpForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpAndSetPassword
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:113
 * @route '/api/v1/auth/verify-otp-and-set-password'
 */
export const verifyOtpAndSetPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpAndSetPassword.url(options),
    method: 'post',
})

verifyOtpAndSetPassword.definition = {
    methods: ["post"],
    url: '/api/v1/auth/verify-otp-and-set-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpAndSetPassword
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:113
 * @route '/api/v1/auth/verify-otp-and-set-password'
 */
verifyOtpAndSetPassword.url = (options?: RouteQueryOptions) => {
    return verifyOtpAndSetPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpAndSetPassword
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:113
 * @route '/api/v1/auth/verify-otp-and-set-password'
 */
verifyOtpAndSetPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpAndSetPassword.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpAndSetPassword
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:113
 * @route '/api/v1/auth/verify-otp-and-set-password'
 */
    const verifyOtpAndSetPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtpAndSetPassword.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::verifyOtpAndSetPassword
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:113
 * @route '/api/v1/auth/verify-otp-and-set-password'
 */
        verifyOtpAndSetPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtpAndSetPassword.url(options),
            method: 'post',
        })
    
    verifyOtpAndSetPassword.form = verifyOtpAndSetPasswordForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::setPasswordWithToken
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:386
 * @route '/api/v1/auth/set-password-with-token'
 */
export const setPasswordWithToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPasswordWithToken.url(options),
    method: 'post',
})

setPasswordWithToken.definition = {
    methods: ["post"],
    url: '/api/v1/auth/set-password-with-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::setPasswordWithToken
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:386
 * @route '/api/v1/auth/set-password-with-token'
 */
setPasswordWithToken.url = (options?: RouteQueryOptions) => {
    return setPasswordWithToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::setPasswordWithToken
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:386
 * @route '/api/v1/auth/set-password-with-token'
 */
setPasswordWithToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPasswordWithToken.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::setPasswordWithToken
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:386
 * @route '/api/v1/auth/set-password-with-token'
 */
    const setPasswordWithTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setPasswordWithToken.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::setPasswordWithToken
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:386
 * @route '/api/v1/auth/set-password-with-token'
 */
        setPasswordWithTokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setPasswordWithToken.url(options),
            method: 'post',
        })
    
    setPasswordWithToken.form = setPasswordWithTokenForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::logout
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:276
 * @route '/api/v1/auth/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/v1/auth/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::logout
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:276
 * @route '/api/v1/auth/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::logout
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:276
 * @route '/api/v1/auth/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::logout
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:276
 * @route '/api/v1/auth/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::logout
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:276
 * @route '/api/v1/auth/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/api/v1/auth/me',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
    const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: me.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
        meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Auth\AuthController::me
 * @see app/Http/Controllers/Api/V1/Auth/AuthController.php:348
 * @route '/api/v1/auth/me'
 */
        meForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    me.form = meForm
const AuthController = { login, register, requestOtpLogin, verifyOtpLogin, verifyOtp, verifyOtpAndSetPassword, setPasswordWithToken, logout, me }

export default AuthController