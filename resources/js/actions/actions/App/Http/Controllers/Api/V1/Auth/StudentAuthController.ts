import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::findApplication
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:37
* @route '/api/v1/student-auth/find-application'
*/
export const findApplication = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: findApplication.url(options),
    method: 'post',
})

findApplication.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/find-application',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::findApplication
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:37
* @route '/api/v1/student-auth/find-application'
*/
findApplication.url = (options?: RouteQueryOptions) => {
    return findApplication.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::findApplication
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:37
* @route '/api/v1/student-auth/find-application'
*/
findApplication.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: findApplication.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::sendOtp
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:71
* @route '/api/v1/student-auth/send-otp'
*/
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/send-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::sendOtp
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:71
* @route '/api/v1/student-auth/send-otp'
*/
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::sendOtp
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:71
* @route '/api/v1/student-auth/send-otp'
*/
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::register
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:94
* @route '/api/v1/student-auth/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::register
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:94
* @route '/api/v1/student-auth/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::register
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:94
* @route '/api/v1/student-auth/register'
*/
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::login
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:257
* @route '/api/v1/student-auth/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::login
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:257
* @route '/api/v1/student-auth/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::login
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:257
* @route '/api/v1/student-auth/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::forgotPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:185
* @route '/api/v1/student-auth/forgot-password'
*/
export const forgotPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgotPassword.url(options),
    method: 'post',
})

forgotPassword.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::forgotPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:185
* @route '/api/v1/student-auth/forgot-password'
*/
forgotPassword.url = (options?: RouteQueryOptions) => {
    return forgotPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::forgotPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:185
* @route '/api/v1/student-auth/forgot-password'
*/
forgotPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgotPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::resetPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:208
* @route '/api/v1/student-auth/reset-password'
*/
export const resetPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::resetPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:208
* @route '/api/v1/student-auth/reset-password'
*/
resetPassword.url = (options?: RouteQueryOptions) => {
    return resetPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::resetPassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:208
* @route '/api/v1/student-auth/reset-password'
*/
resetPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::requestOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:304
* @route '/api/v1/student-auth/request-otp-login'
*/
export const requestOtpLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestOtpLogin.url(options),
    method: 'post',
})

requestOtpLogin.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/request-otp-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::requestOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:304
* @route '/api/v1/student-auth/request-otp-login'
*/
requestOtpLogin.url = (options?: RouteQueryOptions) => {
    return requestOtpLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::requestOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:304
* @route '/api/v1/student-auth/request-otp-login'
*/
requestOtpLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestOtpLogin.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::verifyOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:343
* @route '/api/v1/student-auth/verify-otp-login'
*/
export const verifyOtpLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpLogin.url(options),
    method: 'post',
})

verifyOtpLogin.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/verify-otp-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::verifyOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:343
* @route '/api/v1/student-auth/verify-otp-login'
*/
verifyOtpLogin.url = (options?: RouteQueryOptions) => {
    return verifyOtpLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::verifyOtpLogin
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:343
* @route '/api/v1/student-auth/verify-otp-login'
*/
verifyOtpLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtpLogin.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::changePassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:385
* @route '/api/v1/student-auth/change-password'
*/
export const changePassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})

changePassword.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/change-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::changePassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:385
* @route '/api/v1/student-auth/change-password'
*/
changePassword.url = (options?: RouteQueryOptions) => {
    return changePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::changePassword
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:385
* @route '/api/v1/student-auth/change-password'
*/
changePassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::logout
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:422
* @route '/api/v1/student-auth/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/v1/student-auth/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::logout
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:422
* @route '/api/v1/student-auth/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Auth\StudentAuthController::logout
* @see app/Http/Controllers/Api/V1/Auth/StudentAuthController.php:422
* @route '/api/v1/student-auth/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

const StudentAuthController = { findApplication, sendOtp, register, login, forgotPassword, resetPassword, requestOtpLogin, verifyOtpLogin, changePassword, logout }

export default StudentAuthController