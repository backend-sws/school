import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import exams from './exams'
import schedules from './schedules'
import gradingScales from './grading-scales'
import marksEntry from './marks-entry'
import marksheet from './marksheet'
import results from './results'
import marksheets from './marksheets'
/**
 * @see routes/web.php:508
 * @route '/examination'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/examination',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:508
 * @route '/examination'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:508
 * @route '/examination'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:508
 * @route '/examination'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:508
 * @route '/examination'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:508
 * @route '/examination'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:508
 * @route '/examination'
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
const examination = {
    index: Object.assign(index, index),
exams: Object.assign(exams, exams),
schedules: Object.assign(schedules, schedules),
gradingScales: Object.assign(gradingScales, gradingScales),
marksEntry: Object.assign(marksEntry, marksEntry),
marksheet: Object.assign(marksheet, marksheet),
results: Object.assign(results, results),
marksheets: Object.assign(marksheets, marksheets),
}

export default examination