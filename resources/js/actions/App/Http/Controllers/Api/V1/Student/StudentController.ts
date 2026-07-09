import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::resendVerificationEmail
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:286
 * @route '/api/v1/students/resend-verification'
 */
export const resendVerificationEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerificationEmail.url(options),
    method: 'post',
})

resendVerificationEmail.definition = {
    methods: ["post"],
    url: '/api/v1/students/resend-verification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::resendVerificationEmail
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:286
 * @route '/api/v1/students/resend-verification'
 */
resendVerificationEmail.url = (options?: RouteQueryOptions) => {
    return resendVerificationEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::resendVerificationEmail
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:286
 * @route '/api/v1/students/resend-verification'
 */
resendVerificationEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerificationEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::resendVerificationEmail
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:286
 * @route '/api/v1/students/resend-verification'
 */
    const resendVerificationEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resendVerificationEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::resendVerificationEmail
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:286
 * @route '/api/v1/students/resend-verification'
 */
        resendVerificationEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resendVerificationEmail.url(options),
            method: 'post',
        })
    
    resendVerificationEmail.form = resendVerificationEmailForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getVerificationLink
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:323
 * @route '/api/v1/students/verification-link'
 */
export const getVerificationLink = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getVerificationLink.url(options),
    method: 'post',
})

getVerificationLink.definition = {
    methods: ["post"],
    url: '/api/v1/students/verification-link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getVerificationLink
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:323
 * @route '/api/v1/students/verification-link'
 */
getVerificationLink.url = (options?: RouteQueryOptions) => {
    return getVerificationLink.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getVerificationLink
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:323
 * @route '/api/v1/students/verification-link'
 */
getVerificationLink.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getVerificationLink.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getVerificationLink
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:323
 * @route '/api/v1/students/verification-link'
 */
    const getVerificationLinkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: getVerificationLink.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getVerificationLink
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:323
 * @route '/api/v1/students/verification-link'
 */
        getVerificationLinkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: getVerificationLink.url(options),
            method: 'post',
        })
    
    getVerificationLink.form = getVerificationLinkForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
export const candidates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidates.url(options),
    method: 'get',
})

candidates.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
candidates.url = (options?: RouteQueryOptions) => {
    return candidates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
candidates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
candidates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: candidates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
    const candidatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: candidates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
        candidatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::candidates
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:468
 * @route '/api/v1/students/candidates'
 */
        candidatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    candidates.form = candidatesForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
export const getStudents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudents.url(options),
    method: 'get',
})

getStudents.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
getStudents.url = (options?: RouteQueryOptions) => {
    return getStudents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
getStudents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStudents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
getStudents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStudents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
    const getStudentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStudents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
        getStudentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::getStudents
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:741
 * @route '/api/v1/students/list'
 */
        getStudentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStudents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStudents.form = getStudentsForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::exportMethod
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:760
 * @route '/api/v1/students/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
export const editCandidate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editCandidate.url(args, options),
    method: 'get',
})

editCandidate.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/candidates/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
editCandidate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return editCandidate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
editCandidate.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editCandidate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
editCandidate.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editCandidate.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
    const editCandidateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editCandidate.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
        editCandidateForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editCandidate.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::editCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:508
 * @route '/api/v1/students/candidates/{id}/edit'
 */
        editCandidateForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editCandidate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editCandidate.form = editCandidateForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::updateCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:606
 * @route '/api/v1/students/candidates/{id}'
 */
export const updateCandidate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCandidate.url(args, options),
    method: 'put',
})

updateCandidate.definition = {
    methods: ["put"],
    url: '/api/v1/students/candidates/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::updateCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:606
 * @route '/api/v1/students/candidates/{id}'
 */
updateCandidate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateCandidate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::updateCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:606
 * @route '/api/v1/students/candidates/{id}'
 */
updateCandidate.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCandidate.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::updateCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:606
 * @route '/api/v1/students/candidates/{id}'
 */
    const updateCandidateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCandidate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::updateCandidate
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:606
 * @route '/api/v1/students/candidates/{id}'
 */
        updateCandidateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCandidate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCandidate.form = updateCandidateForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::toggleCandidateStatus
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:688
 * @route '/api/v1/students/candidates/{id}/status'
 */
export const toggleCandidateStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleCandidateStatus.url(args, options),
    method: 'put',
})

toggleCandidateStatus.definition = {
    methods: ["put"],
    url: '/api/v1/students/candidates/{id}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::toggleCandidateStatus
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:688
 * @route '/api/v1/students/candidates/{id}/status'
 */
toggleCandidateStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleCandidateStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::toggleCandidateStatus
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:688
 * @route '/api/v1/students/candidates/{id}/status'
 */
toggleCandidateStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleCandidateStatus.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::toggleCandidateStatus
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:688
 * @route '/api/v1/students/candidates/{id}/status'
 */
    const toggleCandidateStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleCandidateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::toggleCandidateStatus
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:688
 * @route '/api/v1/students/candidates/{id}/status'
 */
        toggleCandidateStatusForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleCandidateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleCandidateStatus.form = toggleCandidateStatusForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::index
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:50
 * @route '/api/v1/students'
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
* @see \App\Http\Controllers\Api\V1\Student\StudentController::store
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:81
 * @route '/api/v1/students'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::store
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:81
 * @route '/api/v1/students'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::store
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:81
 * @route '/api/v1/students'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::store
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:81
 * @route '/api/v1/students'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::store
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:81
 * @route '/api/v1/students'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
export const show = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/{student}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
show.url = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return show.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
show.get = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
show.head = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
    const showForm = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
        showForm.get = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::show
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:113
 * @route '/api/v1/students/{student}'
 */
        showForm.head = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
export const update = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/students/{student}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
update.url = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: args.student,
                }

    return update.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
update.put = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
update.patch = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
    const updateForm = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
        updateForm.put = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::update
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:208
 * @route '/api/v1/students/{student}'
 */
        updateForm.patch = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::destroy
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:370
 * @route '/api/v1/students/{student}'
 */
export const destroy = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/students/{student}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::destroy
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:370
 * @route '/api/v1/students/{student}'
 */
destroy.url = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return destroy.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::destroy
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:370
 * @route '/api/v1/students/{student}'
 */
destroy.delete = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::destroy
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:370
 * @route '/api/v1/students/{student}'
 */
    const destroyForm = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Student\StudentController::destroy
 * @see app/Http/Controllers/Api/V1/Student/StudentController.php:370
 * @route '/api/v1/students/{student}'
 */
        destroyForm.delete = (args: { student: string | number | { id: string | number } } | [student: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StudentController = { resendVerificationEmail, getVerificationLink, candidates, getStudents, exportMethod, editCandidate, updateCandidate, toggleCandidateStatus, index, store, show, update, destroy, export: exportMethod }

export default StudentController