import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
export const studentRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentRegister.url(options),
    method: 'get',
})

studentRegister.definition = {
    methods: ["get","head"],
    url: '/student-portal/register',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
studentRegister.url = (options?: RouteQueryOptions) => {
    return studentRegister.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
studentRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentRegister.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
studentRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentRegister.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
    const studentRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentRegister.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
        studentRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentRegister.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:15
 * @route '/student-portal/register'
 */
        studentRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentRegister.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentRegister.form = studentRegisterForm
/**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
export const studentDashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentDashboard.url(options),
    method: 'get',
})

studentDashboard.definition = {
    methods: ["get","head"],
    url: '/student-portal/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
studentDashboard.url = (options?: RouteQueryOptions) => {
    return studentDashboard.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
studentDashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentDashboard.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
studentDashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentDashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
    const studentDashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentDashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
        studentDashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentDashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:28
 * @route '/student-portal/dashboard'
 */
        studentDashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentDashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentDashboard.form = studentDashboardForm
/**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
export const myStudents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myStudents.url(options),
    method: 'get',
})

myStudents.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-students',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
myStudents.url = (options?: RouteQueryOptions) => {
    return myStudents.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
myStudents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myStudents.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
myStudents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myStudents.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
    const myStudentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myStudents.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
        myStudentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myStudents.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:32
 * @route '/student-portal/my-students'
 */
        myStudentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myStudents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myStudents.form = myStudentsForm
/**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
export const linkAccountVerify = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: linkAccountVerify.url(options),
    method: 'get',
})

linkAccountVerify.definition = {
    methods: ["get","head"],
    url: '/student-portal/link-account/verify',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
linkAccountVerify.url = (options?: RouteQueryOptions) => {
    return linkAccountVerify.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
linkAccountVerify.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: linkAccountVerify.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
linkAccountVerify.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: linkAccountVerify.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
    const linkAccountVerifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: linkAccountVerify.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
        linkAccountVerifyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: linkAccountVerify.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:36
 * @route '/student-portal/link-account/verify'
 */
        linkAccountVerifyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: linkAccountVerify.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    linkAccountVerify.form = linkAccountVerifyForm
/**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
export const studentTicket = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentTicket.url(options),
    method: 'get',
})

studentTicket.definition = {
    methods: ["get","head"],
    url: '/student-portal/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
studentTicket.url = (options?: RouteQueryOptions) => {
    return studentTicket.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
studentTicket.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentTicket.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
studentTicket.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentTicket.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
    const studentTicketForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentTicket.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
        studentTicketForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentTicket.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:42
 * @route '/student-portal/tickets'
 */
        studentTicketForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentTicket.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentTicket.form = studentTicketForm
/**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
export const studentReadmission = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentReadmission.url(options),
    method: 'get',
})

studentReadmission.definition = {
    methods: ["get","head"],
    url: '/student-portal/readmission',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
studentReadmission.url = (options?: RouteQueryOptions) => {
    return studentReadmission.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
studentReadmission.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentReadmission.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
studentReadmission.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentReadmission.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
    const studentReadmissionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentReadmission.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
        studentReadmissionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentReadmission.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:45
 * @route '/student-portal/readmission'
 */
        studentReadmissionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentReadmission.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentReadmission.form = studentReadmissionForm
/**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
export const studentAdmission = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentAdmission.url(options),
    method: 'get',
})

studentAdmission.definition = {
    methods: ["get","head"],
    url: '/student-portal/admission',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
studentAdmission.url = (options?: RouteQueryOptions) => {
    return studentAdmission.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
studentAdmission.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentAdmission.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
studentAdmission.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentAdmission.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
    const studentAdmissionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentAdmission.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
        studentAdmissionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentAdmission.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:48
 * @route '/student-portal/admission'
 */
        studentAdmissionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentAdmission.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentAdmission.form = studentAdmissionForm
/**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
export const studentApplications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentApplications.url(options),
    method: 'get',
})

studentApplications.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-applications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
studentApplications.url = (options?: RouteQueryOptions) => {
    return studentApplications.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
studentApplications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentApplications.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
studentApplications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentApplications.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
    const studentApplicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentApplications.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
        studentApplicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentApplications.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:51
 * @route '/student-portal/my-applications'
 */
        studentApplicationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentApplications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentApplications.form = studentApplicationsForm
/**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
export const studentCertificate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentCertificate.url(options),
    method: 'get',
})

studentCertificate.definition = {
    methods: ["get","head"],
    url: '/student-portal/certificates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
studentCertificate.url = (options?: RouteQueryOptions) => {
    return studentCertificate.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
studentCertificate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentCertificate.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
studentCertificate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentCertificate.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
    const studentCertificateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentCertificate.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
        studentCertificateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentCertificate.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:54
 * @route '/student-portal/certificates'
 */
        studentCertificateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentCertificate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentCertificate.form = studentCertificateForm
/**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
export const myStudentCertificate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myStudentCertificate.url(options),
    method: 'get',
})

myStudentCertificate.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-certificates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
myStudentCertificate.url = (options?: RouteQueryOptions) => {
    return myStudentCertificate.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
myStudentCertificate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myStudentCertificate.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
myStudentCertificate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myStudentCertificate.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
    const myStudentCertificateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: myStudentCertificate.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
        myStudentCertificateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myStudentCertificate.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:57
 * @route '/student-portal/my-certificates'
 */
        myStudentCertificateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: myStudentCertificate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    myStudentCertificate.form = myStudentCertificateForm
/**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
export const studentFees = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentFees.url(options),
    method: 'get',
})

studentFees.definition = {
    methods: ["get","head"],
    url: '/student-portal/fees',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
studentFees.url = (options?: RouteQueryOptions) => {
    return studentFees.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
studentFees.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentFees.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
studentFees.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentFees.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
    const studentFeesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentFees.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
        studentFeesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentFees.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:60
 * @route '/student-portal/fees'
 */
        studentFeesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentFees.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentFees.form = studentFeesForm
/**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
export const studentFeesHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentFeesHistory.url(options),
    method: 'get',
})

studentFeesHistory.definition = {
    methods: ["get","head"],
    url: '/student-portal/fees/history',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
studentFeesHistory.url = (options?: RouteQueryOptions) => {
    return studentFeesHistory.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
studentFeesHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentFeesHistory.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
studentFeesHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentFeesHistory.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
    const studentFeesHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentFeesHistory.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
        studentFeesHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentFeesHistory.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:63
 * @route '/student-portal/fees/history'
 */
        studentFeesHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentFeesHistory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentFeesHistory.form = studentFeesHistoryForm
/**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
export const studentMyClasses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClasses.url(options),
    method: 'get',
})

studentMyClasses.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-classes',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
studentMyClasses.url = (options?: RouteQueryOptions) => {
    return studentMyClasses.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
studentMyClasses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClasses.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
studentMyClasses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentMyClasses.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
    const studentMyClassesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentMyClasses.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
        studentMyClassesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClasses.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:67
 * @route '/student-portal/my-classes'
 */
        studentMyClassesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClasses.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentMyClasses.form = studentMyClassesForm
/**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
export const studentMyClassDetail = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassDetail.url(args, options),
    method: 'get',
})

studentMyClassDetail.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-classes/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
studentMyClassDetail.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return studentMyClassDetail.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
studentMyClassDetail.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassDetail.url(args, options),
    method: 'get',
})
/**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
studentMyClassDetail.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentMyClassDetail.url(args, options),
    method: 'head',
})

    /**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
    const studentMyClassDetailForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentMyClassDetail.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
        studentMyClassDetailForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassDetail.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/student.php:89
 * @route '/student-portal/my-classes/{id}'
 */
        studentMyClassDetailForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassDetail.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentMyClassDetail.form = studentMyClassDetailForm
/**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
export const studentMyClassSubject = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassSubject.url(args, options),
    method: 'get',
})

studentMyClassSubject.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-classes/{id}/subjects/{allocationId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
studentMyClassSubject.url = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    allocationId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                allocationId: args.allocationId,
                }

    return studentMyClassSubject.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{allocationId}', parsedArgs.allocationId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
studentMyClassSubject.get = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassSubject.url(args, options),
    method: 'get',
})
/**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
studentMyClassSubject.head = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentMyClassSubject.url(args, options),
    method: 'head',
})

    /**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
    const studentMyClassSubjectForm = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentMyClassSubject.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
        studentMyClassSubjectForm.get = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassSubject.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/student.php:96
 * @route '/student-portal/my-classes/{id}/subjects/{allocationId}'
 */
        studentMyClassSubjectForm.head = (args: { id: string | number, allocationId: string | number } | [id: string | number, allocationId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassSubject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentMyClassSubject.form = studentMyClassSubjectForm
/**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
export const studentMyClassRoom = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassRoom.url(args, options),
    method: 'get',
})

studentMyClassRoom.definition = {
    methods: ["get","head"],
    url: '/student-portal/my-classes/{id}/rooms/{roomId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
studentMyClassRoom.url = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    roomId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                roomId: args.roomId,
                }

    return studentMyClassRoom.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{roomId}', parsedArgs.roomId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
studentMyClassRoom.get = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMyClassRoom.url(args, options),
    method: 'get',
})
/**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
studentMyClassRoom.head = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentMyClassRoom.url(args, options),
    method: 'head',
})

    /**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
    const studentMyClassRoomForm = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentMyClassRoom.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
        studentMyClassRoomForm.get = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassRoom.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/student.php:105
 * @route '/student-portal/my-classes/{id}/rooms/{roomId}'
 */
        studentMyClassRoomForm.head = (args: { id: string | number, roomId: string | number } | [id: string | number, roomId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMyClassRoom.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentMyClassRoom.form = studentMyClassRoomForm
/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
export const studentMarksheet = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMarksheet.url(args, options),
    method: 'get',
})

studentMarksheet.definition = {
    methods: ["get","head"],
    url: '/student-portal/exams/{exam}/marksheet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
studentMarksheet.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { exam: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    exam: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exam: typeof args.exam === 'object'
                ? args.exam.id
                : args.exam,
                }

    return studentMarksheet.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
studentMarksheet.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentMarksheet.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
studentMarksheet.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentMarksheet.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
    const studentMarksheetForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentMarksheet.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
        studentMarksheetForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMarksheet.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Examination\MarksheetController::studentMarksheet
 * @see app/Http/Controllers/Examination/MarksheetController.php:38
 * @route '/student-portal/exams/{exam}/marksheet'
 */
        studentMarksheetForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentMarksheet.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentMarksheet.form = studentMarksheetForm
const student = {
    studentRegister: Object.assign(studentRegister, studentRegister),
studentDashboard: Object.assign(studentDashboard, studentDashboard),
myStudents: Object.assign(myStudents, myStudents),
linkAccountVerify: Object.assign(linkAccountVerify, linkAccountVerify),
studentTicket: Object.assign(studentTicket, studentTicket),
studentReadmission: Object.assign(studentReadmission, studentReadmission),
studentAdmission: Object.assign(studentAdmission, studentAdmission),
studentApplications: Object.assign(studentApplications, studentApplications),
studentCertificate: Object.assign(studentCertificate, studentCertificate),
myStudentCertificate: Object.assign(myStudentCertificate, myStudentCertificate),
studentFees: Object.assign(studentFees, studentFees),
studentFeesHistory: Object.assign(studentFeesHistory, studentFeesHistory),
studentMyClasses: Object.assign(studentMyClasses, studentMyClasses),
studentMyClassDetail: Object.assign(studentMyClassDetail, studentMyClassDetail),
studentMyClassSubject: Object.assign(studentMyClassSubject, studentMyClassSubject),
studentMyClassRoom: Object.assign(studentMyClassRoom, studentMyClassRoom),
studentMarksheet: Object.assign(studentMarksheet, studentMarksheet),
}

export default student