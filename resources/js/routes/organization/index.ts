import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import departments36a8ae from './departments'
import mainStreams35ff4f from './main-streams'
import streams3c515f from './streams'
import sessions2b6d10 from './sessions'
/**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
export const departments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})

departments.definition = {
    methods: ["get","head"],
    url: '/organization/departments',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
departments.url = (options?: RouteQueryOptions) => {
    return departments.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
departments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
departments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: departments.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
    const departmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: departments.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
        departmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: departments.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:195
 * @route '/organization/departments'
 */
        departmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: departments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    departments.form = departmentsForm
/**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
export const mainStreams = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mainStreams.url(options),
    method: 'get',
})

mainStreams.definition = {
    methods: ["get","head"],
    url: '/organization/main-streams',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
mainStreams.url = (options?: RouteQueryOptions) => {
    return mainStreams.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
mainStreams.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mainStreams.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
mainStreams.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mainStreams.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
    const mainStreamsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mainStreams.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
        mainStreamsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mainStreams.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:200
 * @route '/organization/main-streams'
 */
        mainStreamsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mainStreams.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mainStreams.form = mainStreamsForm
/**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
export const streams = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streams.url(options),
    method: 'get',
})

streams.definition = {
    methods: ["get","head"],
    url: '/organization/streams',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
streams.url = (options?: RouteQueryOptions) => {
    return streams.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
streams.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streams.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
streams.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streams.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
    const streamsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streams.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
        streamsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streams.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:204
 * @route '/organization/streams'
 */
        streamsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streams.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streams.form = streamsForm
/**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
export const sessions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessions.url(options),
    method: 'get',
})

sessions.definition = {
    methods: ["get","head"],
    url: '/organization/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
sessions.url = (options?: RouteQueryOptions) => {
    return sessions.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
sessions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessions.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
sessions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessions.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
    const sessionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessions.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
        sessionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessions.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:208
 * @route '/organization/sessions'
 */
        sessionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessions.form = sessionsForm
/**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
export const subjectCategory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectCategory.url(options),
    method: 'get',
})

subjectCategory.definition = {
    methods: ["get","head"],
    url: '/organization/subject-category',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
subjectCategory.url = (options?: RouteQueryOptions) => {
    return subjectCategory.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
subjectCategory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectCategory.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
subjectCategory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subjectCategory.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
    const subjectCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subjectCategory.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
        subjectCategoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectCategory.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:212
 * @route '/organization/subject-category'
 */
        subjectCategoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectCategory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subjectCategory.form = subjectCategoryForm
/**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
export const subjectGroups = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectGroups.url(options),
    method: 'get',
})

subjectGroups.definition = {
    methods: ["get","head"],
    url: '/organization/subject-groups',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
subjectGroups.url = (options?: RouteQueryOptions) => {
    return subjectGroups.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
subjectGroups.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectGroups.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
subjectGroups.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subjectGroups.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
    const subjectGroupsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subjectGroups.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
        subjectGroupsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectGroups.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:213
 * @route '/organization/subject-groups'
 */
        subjectGroupsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectGroups.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subjectGroups.form = subjectGroupsForm
/**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
export const subject = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subject.url(options),
    method: 'get',
})

subject.definition = {
    methods: ["get","head"],
    url: '/organization/subject',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
subject.url = (options?: RouteQueryOptions) => {
    return subject.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
subject.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subject.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
subject.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subject.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
    const subjectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subject.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
        subjectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subject.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:214
 * @route '/organization/subject'
 */
        subjectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subject.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subject.form = subjectForm
/**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
export const subjectCategoryMapping = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectCategoryMapping.url(options),
    method: 'get',
})

subjectCategoryMapping.definition = {
    methods: ["get","head"],
    url: '/organization/subject-category-mapping',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
subjectCategoryMapping.url = (options?: RouteQueryOptions) => {
    return subjectCategoryMapping.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
subjectCategoryMapping.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subjectCategoryMapping.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
subjectCategoryMapping.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subjectCategoryMapping.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
    const subjectCategoryMappingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subjectCategoryMapping.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
        subjectCategoryMappingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectCategoryMapping.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:215
 * @route '/organization/subject-category-mapping'
 */
        subjectCategoryMappingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subjectCategoryMapping.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subjectCategoryMapping.form = subjectCategoryMappingForm
const organization = {
    departments: Object.assign(departments, departments36a8ae),
mainStreams: Object.assign(mainStreams, mainStreams35ff4f),
streams: Object.assign(streams, streams3c515f),
sessions: Object.assign(sessions, sessions2b6d10),
subjectCategory: Object.assign(subjectCategory, subjectCategory),
subjectGroups: Object.assign(subjectGroups, subjectGroups),
subject: Object.assign(subject, subject),
subjectCategoryMapping: Object.assign(subjectCategoryMapping, subjectCategoryMapping),
}

export default organization