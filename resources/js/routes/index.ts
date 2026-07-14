import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\OnboardingController::register
 * @see app/Http/Controllers/Web/OnboardingController.php:32
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
 * @see routes/web.php:12
 * @route '/metrics'
 */
export const metrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})

metrics.definition = {
    methods: ["get","head"],
    url: '/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:12
 * @route '/metrics'
 */
metrics.url = (options?: RouteQueryOptions) => {
    return metrics.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:12
 * @route '/metrics'
 */
metrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:12
 * @route '/metrics'
 */
metrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metrics.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:12
 * @route '/metrics'
 */
    const metricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metrics.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:12
 * @route '/metrics'
 */
        metricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:12
 * @route '/metrics'
 */
        metricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metrics.form = metricsForm
/**
 * @see routes/web.php:42
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:42
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:42
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:42
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:42
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:42
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:42
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
export const aboutUs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboutUs.url(options),
    method: 'get',
})

aboutUs.definition = {
    methods: ["get","head"],
    url: '/about-us',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
aboutUs.url = (options?: RouteQueryOptions) => {
    return aboutUs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
aboutUs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aboutUs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
aboutUs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: aboutUs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
    const aboutUsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: aboutUs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
        aboutUsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: aboutUs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::aboutUs
 * @see app/Http/Controllers/Web/WebsiteController.php:184
 * @route '/about-us'
 */
        aboutUsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: aboutUs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    aboutUs.form = aboutUsForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
    const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
        contactForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::contact
 * @see app/Http/Controllers/Web/WebsiteController.php:251
 * @route '/contact'
 */
        contactForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
export const gallery = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})

gallery.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
gallery.url = (options?: RouteQueryOptions) => {
    return gallery.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
gallery.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
gallery.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gallery.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
    const galleryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: gallery.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
        galleryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gallery.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::gallery
 * @see app/Http/Controllers/Web/WebsiteController.php:157
 * @route '/gallery'
 */
        galleryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gallery.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    gallery.form = galleryForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
export const approval = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(options),
    method: 'get',
})

approval.definition = {
    methods: ["get","head"],
    url: '/approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
approval.url = (options?: RouteQueryOptions) => {
    return approval.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
approval.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
approval.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approval.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
    const approvalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: approval.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
        approvalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approval.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::approval
 * @see app/Http/Controllers/Web/WebsiteController.php:260
 * @route '/approval'
 */
        approvalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approval.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    approval.form = approvalForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
export const academics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academics.url(options),
    method: 'get',
})

academics.definition = {
    methods: ["get","head"],
    url: '/academics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
academics.url = (options?: RouteQueryOptions) => {
    return academics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
academics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: academics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
academics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: academics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
    const academicsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: academics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
        academicsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: academics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::academics
 * @see app/Http/Controllers/Web/WebsiteController.php:270
 * @route '/academics'
 */
        academicsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: academics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    academics.form = academicsForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
export const departments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})

departments.definition = {
    methods: ["get","head"],
    url: '/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
departments.url = (options?: RouteQueryOptions) => {
    return departments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
departments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
departments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: departments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
    const departmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: departments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
 */
        departmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: departments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::departments
 * @see app/Http/Controllers/Web/WebsiteController.php:294
 * @route '/departments'
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
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
export const facilities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilities.url(options),
    method: 'get',
})

facilities.definition = {
    methods: ["get","head"],
    url: '/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
facilities.url = (options?: RouteQueryOptions) => {
    return facilities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
facilities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: facilities.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
facilities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: facilities.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
    const facilitiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: facilities.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
        facilitiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facilities.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::facilities
 * @see app/Http/Controllers/Web/WebsiteController.php:305
 * @route '/facilities'
 */
        facilitiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: facilities.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    facilities.form = facilitiesForm
/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
export const trainingPlacement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trainingPlacement.url(options),
    method: 'get',
})

trainingPlacement.definition = {
    methods: ["get","head"],
    url: '/training-placement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
trainingPlacement.url = (options?: RouteQueryOptions) => {
    return trainingPlacement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
trainingPlacement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trainingPlacement.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
trainingPlacement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trainingPlacement.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
    const trainingPlacementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: trainingPlacement.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
        trainingPlacementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trainingPlacement.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\WebsiteController::trainingPlacement
 * @see app/Http/Controllers/Web/WebsiteController.php:315
 * @route '/training-placement'
 */
        trainingPlacementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trainingPlacement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    trainingPlacement.form = trainingPlacementForm
/**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
export const verifyAccount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyAccount.url(options),
    method: 'get',
})

verifyAccount.definition = {
    methods: ["get","head"],
    url: '/verify-account',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
verifyAccount.url = (options?: RouteQueryOptions) => {
    return verifyAccount.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
verifyAccount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyAccount.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
verifyAccount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyAccount.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
    const verifyAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verifyAccount.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
        verifyAccountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyAccount.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:100
 * @route '/verify-account'
 */
        verifyAccountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyAccount.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verifyAccount.form = verifyAccountForm
/**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:155
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
 * @see routes/web.php:177
 * @route '/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:177
 * @route '/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:177
 * @route '/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:177
 * @route '/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:177
 * @route '/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:177
 * @route '/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:177
 * @route '/notifications'
 */
        notificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notifications.form = notificationsForm
/**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
export const noticeManagement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noticeManagement.url(options),
    method: 'get',
})

noticeManagement.definition = {
    methods: ["get","head"],
    url: '/notice-management',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
noticeManagement.url = (options?: RouteQueryOptions) => {
    return noticeManagement.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
noticeManagement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noticeManagement.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
noticeManagement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: noticeManagement.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
    const noticeManagementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: noticeManagement.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
        noticeManagementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noticeManagement.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:379
 * @route '/notice-management'
 */
        noticeManagementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noticeManagement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    noticeManagement.form = noticeManagementForm
/**
 * @see routes/web.php:553
 * @route '/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:553
 * @route '/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:553
 * @route '/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:553
 * @route '/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:553
 * @route '/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:553
 * @route '/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:553
 * @route '/analytics'
 */
        analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
export const streamForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamForm.url(options),
    method: 'get',
})

streamForm.definition = {
    methods: ["get","head"],
    url: '/settings/stream-form',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
streamForm.url = (options?: RouteQueryOptions) => {
    return streamForm.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
streamForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamForm.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
streamForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamForm.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
    const streamFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: streamForm.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
        streamFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamForm.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:48
 * @route '/settings/stream-form'
 */
        streamFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: streamForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    streamForm.form = streamFormForm
/**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
export const admissionSetting = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionSetting.url(options),
    method: 'get',
})

admissionSetting.definition = {
    methods: ["get","head"],
    url: '/settings/admission-setting',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
admissionSetting.url = (options?: RouteQueryOptions) => {
    return admissionSetting.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
admissionSetting.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionSetting.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
admissionSetting.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admissionSetting.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
    const admissionSettingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: admissionSetting.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
        admissionSettingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionSetting.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:53
 * @route '/settings/admission-setting'
 */
        admissionSettingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionSetting.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    admissionSetting.form = admissionSettingForm
/**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
export const readmissionSetting = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissionSetting.url(options),
    method: 'get',
})

readmissionSetting.definition = {
    methods: ["get","head"],
    url: '/settings/readmission-setting',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
readmissionSetting.url = (options?: RouteQueryOptions) => {
    return readmissionSetting.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
readmissionSetting.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: readmissionSetting.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
readmissionSetting.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: readmissionSetting.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
    const readmissionSettingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: readmissionSetting.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
        readmissionSettingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissionSetting.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:56
 * @route '/settings/readmission-setting'
 */
        readmissionSettingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: readmissionSetting.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    readmissionSetting.form = readmissionSettingForm
/**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
export const admissionVerification = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionVerification.url(options),
    method: 'get',
})

admissionVerification.definition = {
    methods: ["get","head"],
    url: '/settings/admission-verification',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
admissionVerification.url = (options?: RouteQueryOptions) => {
    return admissionVerification.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
admissionVerification.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionVerification.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
admissionVerification.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admissionVerification.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
    const admissionVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: admissionVerification.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
        admissionVerificationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionVerification.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:59
 * @route '/settings/admission-verification'
 */
        admissionVerificationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionVerification.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    admissionVerification.form = admissionVerificationForm
/**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
export const studentVerification = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentVerification.url(options),
    method: 'get',
})

studentVerification.definition = {
    methods: ["get","head"],
    url: '/settings/student-verification',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
studentVerification.url = (options?: RouteQueryOptions) => {
    return studentVerification.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
studentVerification.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studentVerification.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
studentVerification.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studentVerification.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
    const studentVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studentVerification.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
        studentVerificationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentVerification.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:62
 * @route '/settings/student-verification'
 */
        studentVerificationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studentVerification.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studentVerification.form = studentVerificationForm
/**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
export const admissionCertificateHead = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionCertificateHead.url(options),
    method: 'get',
})

admissionCertificateHead.definition = {
    methods: ["get","head"],
    url: '/settings/admission-certificate-head',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
admissionCertificateHead.url = (options?: RouteQueryOptions) => {
    return admissionCertificateHead.definition.url + queryParams(options)
}

/**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
admissionCertificateHead.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admissionCertificateHead.url(options),
    method: 'get',
})
/**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
admissionCertificateHead.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admissionCertificateHead.url(options),
    method: 'head',
})

    /**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
    const admissionCertificateHeadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: admissionCertificateHead.url(options),
        method: 'get',
    })

            /**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
        admissionCertificateHeadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionCertificateHead.url(options),
            method: 'get',
        })
            /**
 * @see routes/settings.php:65
 * @route '/settings/admission-certificate-head'
 */
        admissionCertificateHeadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: admissionCertificateHead.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    admissionCertificateHead.form = admissionCertificateHeadForm
/**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
export const paymentSuccess = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSuccess.url(options),
    method: 'get',
})

paymentSuccess.definition = {
    methods: ["get","head"],
    url: '/payment/success',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
paymentSuccess.url = (options?: RouteQueryOptions) => {
    return paymentSuccess.definition.url + queryParams(options)
}

/**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
paymentSuccess.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSuccess.url(options),
    method: 'get',
})
/**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
paymentSuccess.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentSuccess.url(options),
    method: 'head',
})

    /**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
    const paymentSuccessForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentSuccess.url(options),
        method: 'get',
    })

            /**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
        paymentSuccessForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSuccess.url(options),
            method: 'get',
        })
            /**
 * @see routes/student.php:17
 * @route '/payment/success'
 */
        paymentSuccessForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSuccess.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentSuccess.form = paymentSuccessForm