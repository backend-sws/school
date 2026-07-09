import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::sameEmailAccounts
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:155
* @route '/api/v1/communications/same-email-accounts'
*/
export const sameEmailAccounts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sameEmailAccounts.url(options),
    method: 'get',
})

sameEmailAccounts.definition = {
    methods: ["get","head"],
    url: '/api/v1/communications/same-email-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::sameEmailAccounts
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:155
* @route '/api/v1/communications/same-email-accounts'
*/
sameEmailAccounts.url = (options?: RouteQueryOptions) => {
    return sameEmailAccounts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::sameEmailAccounts
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:155
* @route '/api/v1/communications/same-email-accounts'
*/
sameEmailAccounts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sameEmailAccounts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::sameEmailAccounts
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:155
* @route '/api/v1/communications/same-email-accounts'
*/
sameEmailAccounts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sameEmailAccounts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::linkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:59
* @route '/api/v1/communications/link-account'
*/
export const linkAccount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkAccount.url(options),
    method: 'post',
})

linkAccount.definition = {
    methods: ["post"],
    url: '/api/v1/communications/link-account',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::linkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:59
* @route '/api/v1/communications/link-account'
*/
linkAccount.url = (options?: RouteQueryOptions) => {
    return linkAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::linkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:59
* @route '/api/v1/communications/link-account'
*/
linkAccount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::verifyLinkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:95
* @route '/api/v1/communications/verify-link-account'
*/
export const verifyLinkAccount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyLinkAccount.url(options),
    method: 'post',
})

verifyLinkAccount.definition = {
    methods: ["post"],
    url: '/api/v1/communications/verify-link-account',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::verifyLinkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:95
* @route '/api/v1/communications/verify-link-account'
*/
verifyLinkAccount.url = (options?: RouteQueryOptions) => {
    return verifyLinkAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::verifyLinkAccount
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:95
* @route '/api/v1/communications/verify-link-account'
*/
verifyLinkAccount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyLinkAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::setActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:128
* @route '/api/v1/communications/active-student'
*/
export const setActiveStudent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setActiveStudent.url(options),
    method: 'post',
})

setActiveStudent.definition = {
    methods: ["post"],
    url: '/api/v1/communications/active-student',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::setActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:128
* @route '/api/v1/communications/active-student'
*/
setActiveStudent.url = (options?: RouteQueryOptions) => {
    return setActiveStudent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::setActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:128
* @route '/api/v1/communications/active-student'
*/
setActiveStudent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setActiveStudent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::clearActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:146
* @route '/api/v1/communications/clear-active-student'
*/
export const clearActiveStudent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearActiveStudent.url(options),
    method: 'post',
})

clearActiveStudent.definition = {
    methods: ["post"],
    url: '/api/v1/communications/clear-active-student',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::clearActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:146
* @route '/api/v1/communications/clear-active-student'
*/
clearActiveStudent.url = (options?: RouteQueryOptions) => {
    return clearActiveStudent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::clearActiveStudent
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:146
* @route '/api/v1/communications/clear-active-student'
*/
clearActiveStudent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearActiveStudent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::me
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:181
* @route '/api/v1/communications/me'
*/
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/api/v1/communications/me',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::me
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:181
* @route '/api/v1/communications/me'
*/
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::me
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:181
* @route '/api/v1/communications/me'
*/
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Guardian\GuardianController::me
* @see app/Http/Controllers/Api/V1/Guardian/GuardianController.php:181
* @route '/api/v1/communications/me'
*/
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

const GuardianController = { sameEmailAccounts, linkAccount, verifyLinkAccount, setActiveStudent, clearActiveStudent, me }

export default GuardianController