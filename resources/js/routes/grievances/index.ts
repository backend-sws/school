import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import contacts677fa8 from './contacts'
/**
 * @see routes/web.php:391
 * @route '/grievances'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/grievances',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:391
 * @route '/grievances'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:391
 * @route '/grievances'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:391
 * @route '/grievances'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:391
 * @route '/grievances'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:391
 * @route '/grievances'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:391
 * @route '/grievances'
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
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
export const feedback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feedback.url(options),
    method: 'get',
})

feedback.definition = {
    methods: ["get","head"],
    url: '/grievances/feedback',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
feedback.url = (options?: RouteQueryOptions) => {
    return feedback.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
feedback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feedback.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
feedback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feedback.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
    const feedbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feedback.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
        feedbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feedback.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:392
 * @route '/grievances/feedback'
 */
        feedbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feedback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feedback.form = feedbackForm
/**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
export const contacts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contacts.url(options),
    method: 'get',
})

contacts.definition = {
    methods: ["get","head"],
    url: '/grievances/contacts',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
contacts.url = (options?: RouteQueryOptions) => {
    return contacts.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
contacts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contacts.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
contacts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contacts.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
    const contactsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contacts.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
        contactsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contacts.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:393
 * @route '/grievances/contacts'
 */
        contactsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contacts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contacts.form = contactsForm
/**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
export const supportTicket = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supportTicket.url(options),
    method: 'get',
})

supportTicket.definition = {
    methods: ["get","head"],
    url: '/grievances/support-ticket',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
supportTicket.url = (options?: RouteQueryOptions) => {
    return supportTicket.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
supportTicket.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supportTicket.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
supportTicket.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supportTicket.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
    const supportTicketForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: supportTicket.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
        supportTicketForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supportTicket.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:394
 * @route '/grievances/support-ticket'
 */
        supportTicketForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supportTicket.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    supportTicket.form = supportTicketForm
const grievances = {
    index: Object.assign(index, index),
feedback: Object.assign(feedback, feedback),
contacts: Object.assign(contacts, contacts677fa8),
supportTicket: Object.assign(supportTicket, supportTicket),
}

export default grievances