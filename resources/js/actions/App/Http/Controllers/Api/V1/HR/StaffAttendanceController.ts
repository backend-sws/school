import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
export const ledger = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(options),
    method: 'get',
})

ledger.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance/ledger',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.url = (options?: RouteQueryOptions) => {
    return ledger.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ledger.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
ledger.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ledger.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
    const ledgerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ledger.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
        ledgerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::ledger
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:186
 * @route '/api/v1/hr/staff-attendance/ledger'
 */
        ledgerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ledger.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ledger.form = ledgerForm
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::exportMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:196
 * @route '/api/v1/hr/staff-attendance/export'
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
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::downloadTemplate
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:207
 * @route '/api/v1/hr/staff-attendance/template'
 */
        downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::importMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:218
 * @route '/api/v1/hr/staff-attendance/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/api/v1/hr/staff-attendance/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::importMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:218
 * @route '/api/v1/hr/staff-attendance/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::importMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:218
 * @route '/api/v1/hr/staff-attendance/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::importMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:218
 * @route '/api/v1/hr/staff-attendance/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::importMethod
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:218
 * @route '/api/v1/hr/staff-attendance/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::markCell
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:121
 * @route '/api/v1/hr/staff-attendance/mark-cell'
 */
export const markCell = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markCell.url(options),
    method: 'post',
})

markCell.definition = {
    methods: ["post"],
    url: '/api/v1/hr/staff-attendance/mark-cell',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::markCell
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:121
 * @route '/api/v1/hr/staff-attendance/mark-cell'
 */
markCell.url = (options?: RouteQueryOptions) => {
    return markCell.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::markCell
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:121
 * @route '/api/v1/hr/staff-attendance/mark-cell'
 */
markCell.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markCell.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::markCell
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:121
 * @route '/api/v1/hr/staff-attendance/mark-cell'
 */
    const markCellForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markCell.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::markCell
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:121
 * @route '/api/v1/hr/staff-attendance/mark-cell'
 */
        markCellForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markCell.url(options),
            method: 'post',
        })
    
    markCell.form = markCellForm
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hr/staff-attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::index
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:19
 * @route '/api/v1/hr/staff-attendance'
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
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:89
 * @route '/api/v1/hr/staff-attendance'
 */
export const mark = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

mark.definition = {
    methods: ["post"],
    url: '/api/v1/hr/staff-attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:89
 * @route '/api/v1/hr/staff-attendance'
 */
mark.url = (options?: RouteQueryOptions) => {
    return mark.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:89
 * @route '/api/v1/hr/staff-attendance'
 */
mark.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:89
 * @route '/api/v1/hr/staff-attendance'
 */
    const markForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: mark.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HR\StaffAttendanceController::mark
 * @see app/Http/Controllers/Api/V1/HR/StaffAttendanceController.php:89
 * @route '/api/v1/hr/staff-attendance'
 */
        markForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: mark.url(options),
            method: 'post',
        })
    
    mark.form = markForm
const StaffAttendanceController = { ledger, exportMethod, downloadTemplate, importMethod, markCell, index, mark, export: exportMethod, import: importMethod }

export default StaffAttendanceController