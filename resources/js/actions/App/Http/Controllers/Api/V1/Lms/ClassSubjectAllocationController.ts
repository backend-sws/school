import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::storeForClass
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
export const storeForClass = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForClass.url(args, options),
    method: 'post',
})

storeForClass.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class}/allocations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::storeForClass
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
storeForClass.url = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lms_class: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lms_class: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lms_class: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lms_class: typeof args.lms_class === 'object'
                ? args.lms_class.id
                : args.lms_class,
                }

    return storeForClass.definition.url
            .replace('{lms_class}', parsedArgs.lms_class.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::storeForClass
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
storeForClass.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForClass.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::storeForClass
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
    const storeForClassForm = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeForClass.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::storeForClass
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:17
 * @route '/api/v1/lms/classes/{lms_class}/allocations'
 */
        storeForClassForm.post = (args: { lms_class: string | number | { id: string | number } } | [lms_class: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeForClass.url(args, options),
            method: 'post',
        })
    
    storeForClass.form = storeForClassForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::update
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:55
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
export const update = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/lms/allocations/{class_subject_allocation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::update
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:55
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
update.url = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { class_subject_allocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { class_subject_allocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    class_subject_allocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class_subject_allocation: typeof args.class_subject_allocation === 'object'
                ? args.class_subject_allocation.id
                : args.class_subject_allocation,
                }

    return update.definition.url
            .replace('{class_subject_allocation}', parsedArgs.class_subject_allocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::update
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:55
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
update.put = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::update
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:55
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
    const updateForm = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::update
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:55
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
        updateForm.put = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:79
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
export const destroy = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/lms/allocations/{class_subject_allocation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:79
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
destroy.url = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { class_subject_allocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { class_subject_allocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    class_subject_allocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        class_subject_allocation: typeof args.class_subject_allocation === 'object'
                ? args.class_subject_allocation.id
                : args.class_subject_allocation,
                }

    return destroy.definition.url
            .replace('{class_subject_allocation}', parsedArgs.class_subject_allocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:79
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
destroy.delete = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:79
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
    const destroyForm = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::destroy
 * @see app/Http/Controllers/Api/V1/Lms/ClassSubjectAllocationController.php:79
 * @route '/api/v1/lms/allocations/{class_subject_allocation}'
 */
        destroyForm.delete = (args: { class_subject_allocation: number | { id: number } } | [class_subject_allocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ClassSubjectAllocationController = { storeForClass, update, destroy }

export default ClassSubjectAllocationController