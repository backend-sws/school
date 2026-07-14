import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import galleries6fe4c2 from './galleries'
/**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
export const builder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})

builder.definition = {
    methods: ["get","head"],
    url: '/website/builder',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
builder.url = (options?: RouteQueryOptions) => {
    return builder.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
builder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
builder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: builder.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
    const builderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: builder.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
        builderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: builder.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:360
 * @route '/website/builder'
 */
        builderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: builder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    builder.form = builderForm
/**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
export const sliders = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sliders.url(options),
    method: 'get',
})

sliders.definition = {
    methods: ["get","head"],
    url: '/website/sliders',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
sliders.url = (options?: RouteQueryOptions) => {
    return sliders.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
sliders.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sliders.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
sliders.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sliders.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
    const slidersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sliders.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
        slidersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sliders.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:361
 * @route '/website/sliders'
 */
        slidersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sliders.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sliders.form = slidersForm
/**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
export const tickers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tickers.url(options),
    method: 'get',
})

tickers.definition = {
    methods: ["get","head"],
    url: '/website/tickers',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
tickers.url = (options?: RouteQueryOptions) => {
    return tickers.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
tickers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tickers.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
tickers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tickers.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
    const tickersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tickers.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
        tickersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tickers.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:362
 * @route '/website/tickers'
 */
        tickersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tickers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tickers.form = tickersForm
/**
 * @see routes/web.php:363
 * @route '/website/news'
 */
export const news = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: news.url(options),
    method: 'get',
})

news.definition = {
    methods: ["get","head"],
    url: '/website/news',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:363
 * @route '/website/news'
 */
news.url = (options?: RouteQueryOptions) => {
    return news.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:363
 * @route '/website/news'
 */
news.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: news.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:363
 * @route '/website/news'
 */
news.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: news.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:363
 * @route '/website/news'
 */
    const newsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: news.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:363
 * @route '/website/news'
 */
        newsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: news.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:363
 * @route '/website/news'
 */
        newsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: news.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    news.form = newsForm
/**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
export const galleries = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleries.url(options),
    method: 'get',
})

galleries.definition = {
    methods: ["get","head"],
    url: '/website/galleries',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
galleries.url = (options?: RouteQueryOptions) => {
    return galleries.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
galleries.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleries.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
galleries.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: galleries.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
    const galleriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: galleries.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
        galleriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: galleries.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:364
 * @route '/website/galleries'
 */
        galleriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: galleries.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    galleries.form = galleriesForm
/**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
export const faculties = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faculties.url(options),
    method: 'get',
})

faculties.definition = {
    methods: ["get","head"],
    url: '/website/faculties',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
faculties.url = (options?: RouteQueryOptions) => {
    return faculties.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
faculties.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faculties.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
faculties.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: faculties.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
    const facultiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: faculties.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
        facultiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: faculties.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:366
 * @route '/website/faculties'
 */
        facultiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: faculties.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    faculties.form = facultiesForm
const website = {
    builder: Object.assign(builder, builder),
sliders: Object.assign(sliders, sliders),
tickers: Object.assign(tickers, tickers),
news: Object.assign(news, news),
galleries: Object.assign(galleries, galleries6fe4c2),
faculties: Object.assign(faculties, faculties),
}

export default website