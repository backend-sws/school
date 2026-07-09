import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:14
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
export const index = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:14
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
index.url = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            assignment_id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        assignment_id: args.assignment_id,
    }

    return index.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{assignment_id}', parsedArgs.assignment_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:14
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
index.get = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::index
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:14
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
index.head = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:30
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
export const store = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:30
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
store.url = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            assignment_id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        assignment_id: args.assignment_id,
    }

    return store.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{assignment_id}', parsedArgs.assignment_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::store
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:30
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions'
*/
store.post = (args: { lms_class_id: string | number, assignment_id: string | number } | [lms_class_id: string | number, assignment_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:64
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions/{submission_id}'
*/
export const update = (args: { lms_class_id: string | number, assignment_id: string | number, submission_id: string | number } | [lms_class_id: string | number, assignment_id: string | number, submission_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions/{submission_id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:64
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions/{submission_id}'
*/
update.url = (args: { lms_class_id: string | number, assignment_id: string | number, submission_id: string | number } | [lms_class_id: string | number, assignment_id: string | number, submission_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            lms_class_id: args[0],
            assignment_id: args[1],
            submission_id: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lms_class_id: args.lms_class_id,
        assignment_id: args.assignment_id,
        submission_id: args.submission_id,
    }

    return update.definition.url
            .replace('{lms_class_id}', parsedArgs.lms_class_id.toString())
            .replace('{assignment_id}', parsedArgs.assignment_id.toString())
            .replace('{submission_id}', parsedArgs.submission_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::update
* @see app/Http/Controllers/Api/V1/Lms/LmsAssignmentSubmissionController.php:64
* @route '/api/v1/lms/classes/{lms_class_id}/assignments/{assignment_id}/submissions/{submission_id}'
*/
update.patch = (args: { lms_class_id: string | number, assignment_id: string | number, submission_id: string | number } | [lms_class_id: string | number, assignment_id: string | number, submission_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

const LmsAssignmentSubmissionController = { index, store, update }

export default LmsAssignmentSubmissionController