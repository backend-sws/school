import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import staffDirectory76ebad from './staff-directory'
/**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
export const feeRules = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeRules.url(options),
    method: 'get',
})

feeRules.definition = {
    methods: ["get","head"],
    url: '/settings/fee-rules',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
feeRules.url = (options?: RouteQueryOptions) => {
    return feeRules.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
feeRules.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feeRules.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
feeRules.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feeRules.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
    const feeRulesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feeRules.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
        feeRulesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeRules.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:51
 * @route '/settings/fee-rules'
 */
        feeRulesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feeRules.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feeRules.form = feeRulesForm
/**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
export const institution = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institution.url(options),
    method: 'get',
})

institution.definition = {
    methods: ["get","head"],
    url: '/settings/institution',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
institution.url = (options?: RouteQueryOptions) => {
    return institution.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
institution.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institution.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
institution.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institution.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
    const institutionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institution.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
        institutionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institution.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:70
 * @route '/settings/institution'
 */
        institutionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institution.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institution.form = institutionForm
/**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
export const digitalPresence = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: digitalPresence.url(options),
    method: 'get',
})

digitalPresence.definition = {
    methods: ["get","head"],
    url: '/settings/digital-presence',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
digitalPresence.url = (options?: RouteQueryOptions) => {
    return digitalPresence.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
digitalPresence.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: digitalPresence.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
digitalPresence.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: digitalPresence.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
    const digitalPresenceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: digitalPresence.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
        digitalPresenceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: digitalPresence.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:73
 * @route '/settings/digital-presence'
 */
        digitalPresenceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: digitalPresence.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    digitalPresence.form = digitalPresenceForm
/**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
export const seo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seo.url(options),
    method: 'get',
})

seo.definition = {
    methods: ["get","head"],
    url: '/settings/seo',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
seo.url = (options?: RouteQueryOptions) => {
    return seo.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
seo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seo.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
seo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: seo.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
    const seoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: seo.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
        seoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seo.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:76
 * @route '/settings/seo'
 */
        seoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    seo.form = seoForm
/**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
export const landingPage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: landingPage.url(options),
    method: 'get',
})

landingPage.definition = {
    methods: ["get","head"],
    url: '/settings/landing-page-content',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
landingPage.url = (options?: RouteQueryOptions) => {
    return landingPage.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
landingPage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: landingPage.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
landingPage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: landingPage.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
    const landingPageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: landingPage.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
        landingPageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: landingPage.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:79
 * @route '/settings/landing-page-content'
 */
        landingPageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: landingPage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    landingPage.form = landingPageForm
/**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
export const institutionalAcademics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalAcademics.url(options),
    method: 'get',
})

institutionalAcademics.definition = {
    methods: ["get","head"],
    url: '/settings/institutional-academics',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
institutionalAcademics.url = (options?: RouteQueryOptions) => {
    return institutionalAcademics.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
institutionalAcademics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalAcademics.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
institutionalAcademics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionalAcademics.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
    const institutionalAcademicsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionalAcademics.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
        institutionalAcademicsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalAcademics.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:83
 * @route '/settings/institutional-academics'
 */
        institutionalAcademicsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalAcademics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionalAcademics.form = institutionalAcademicsForm
/**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
export const institutionalDepartments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalDepartments.url(options),
    method: 'get',
})

institutionalDepartments.definition = {
    methods: ["get","head"],
    url: '/settings/institutional-departments',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
institutionalDepartments.url = (options?: RouteQueryOptions) => {
    return institutionalDepartments.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
institutionalDepartments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalDepartments.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
institutionalDepartments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionalDepartments.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
    const institutionalDepartmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionalDepartments.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
        institutionalDepartmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalDepartments.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:86
 * @route '/settings/institutional-departments'
 */
        institutionalDepartmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalDepartments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionalDepartments.form = institutionalDepartmentsForm
/**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
export const institutionalFacilities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalFacilities.url(options),
    method: 'get',
})

institutionalFacilities.definition = {
    methods: ["get","head"],
    url: '/settings/institutional-facilities',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
institutionalFacilities.url = (options?: RouteQueryOptions) => {
    return institutionalFacilities.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
institutionalFacilities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalFacilities.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
institutionalFacilities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionalFacilities.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
    const institutionalFacilitiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionalFacilities.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
        institutionalFacilitiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalFacilities.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:89
 * @route '/settings/institutional-facilities'
 */
        institutionalFacilitiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalFacilities.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionalFacilities.form = institutionalFacilitiesForm
/**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
export const institutionalPlacement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalPlacement.url(options),
    method: 'get',
})

institutionalPlacement.definition = {
    methods: ["get","head"],
    url: '/settings/institutional-placement',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
institutionalPlacement.url = (options?: RouteQueryOptions) => {
    return institutionalPlacement.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
institutionalPlacement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalPlacement.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
institutionalPlacement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionalPlacement.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
    const institutionalPlacementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionalPlacement.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
        institutionalPlacementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalPlacement.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:92
 * @route '/settings/institutional-placement'
 */
        institutionalPlacementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalPlacement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionalPlacement.form = institutionalPlacementForm
/**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
export const institutionalApprovals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalApprovals.url(options),
    method: 'get',
})

institutionalApprovals.definition = {
    methods: ["get","head"],
    url: '/settings/institutional-approvals',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
institutionalApprovals.url = (options?: RouteQueryOptions) => {
    return institutionalApprovals.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
institutionalApprovals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: institutionalApprovals.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
institutionalApprovals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: institutionalApprovals.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
    const institutionalApprovalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: institutionalApprovals.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
        institutionalApprovalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalApprovals.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:95
 * @route '/settings/institutional-approvals'
 */
        institutionalApprovalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: institutionalApprovals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    institutionalApprovals.form = institutionalApprovalsForm
/**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
export const academicCalendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academicCalendar.url(options),
    method: 'get',
})

academicCalendar.definition = {
    methods: ["get","head"],
    url: '/settings/academic-calendar',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
academicCalendar.url = (options?: RouteQueryOptions) => {
    return academicCalendar.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
academicCalendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academicCalendar.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
academicCalendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: academicCalendar.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
    const academicCalendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: academicCalendar.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
        academicCalendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: academicCalendar.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:99
 * @route '/settings/academic-calendar'
 */
        academicCalendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: academicCalendar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    academicCalendar.form = academicCalendarForm
/**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
export const staffDirectory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staffDirectory.url(options),
    method: 'get',
})

staffDirectory.definition = {
    methods: ["get","head"],
    url: '/settings/staff-directory',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
staffDirectory.url = (options?: RouteQueryOptions) => {
    return staffDirectory.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
staffDirectory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: staffDirectory.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
staffDirectory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: staffDirectory.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
    const staffDirectoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: staffDirectory.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
        staffDirectoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: staffDirectory.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:103
 * @route '/settings/staff-directory'
 */
        staffDirectoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: staffDirectory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    staffDirectory.form = staffDirectoryForm
const settings = {
    feeRules: Object.assign(feeRules, feeRules),
institution: Object.assign(institution, institution),
digitalPresence: Object.assign(digitalPresence, digitalPresence),
seo: Object.assign(seo, seo),
landingPage: Object.assign(landingPage, landingPage),
institutionalAcademics: Object.assign(institutionalAcademics, institutionalAcademics),
institutionalDepartments: Object.assign(institutionalDepartments, institutionalDepartments),
institutionalFacilities: Object.assign(institutionalFacilities, institutionalFacilities),
institutionalPlacement: Object.assign(institutionalPlacement, institutionalPlacement),
institutionalApprovals: Object.assign(institutionalApprovals, institutionalApprovals),
academicCalendar: Object.assign(academicCalendar, academicCalendar),
staffDirectory: Object.assign(staffDirectory, staffDirectory76ebad),
}

export default settings