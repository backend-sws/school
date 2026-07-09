import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const mutationCache = new MutationCache({
    onSuccess(data: any) {
        // Show success toast if API returns a message
        const successMessage = data?.data?.message;
        if (successMessage) {
            toast.success(successMessage);
        }
    },
    onError(error: any) {
        // Handle 401 errors globally
        if (error?.code === 401 || error?.response?.status === 401) {
            // Handle logout if needed
            return;
        }

        // Extract and show error message
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
    },
});

const queryCache = new QueryCache({
    onError(error: any) {
        // Handle 401 errors globally
        if (error?.code === 401 || error?.response?.status === 401) {
            // Handle logout if needed
            return;
        }

        // Don't show toast for query errors by default (can be noisy)
        // Individual queries can handle their own errors
    },
});

export const queryClient = new QueryClient({
    mutationCache,
    queryCache,
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: any) => {
                // Don't retry on specific error codes
                const status = error?.response?.status || error?.code;
                if ([401, 403, 404, 422].includes(status)) return false;

                // Don't retry on server errors
                if (status >= 500) return false;

                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
        },
        mutations: {
            retry: false,
        },
    },
});

// Helper function to extract error message from various error formats
export const getErrorMessage = (error: any): string => {
    if (!error) return "An error occurred";

    // API error format: { success: false, message: "..." }
    if (error.success === false && error.message) {
        return error.message;
    }

    // Axios error format: error.response.data.message
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Laravel validation errors: error.response.data.errors
    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }

    // Standard Error object
    if (error.message) {
        return error.message;
    }

    // String error
    if (typeof error === "string") {
        return error;
    }

    return "An error occurred";
};

// Helper function to get full error info
export const getErrorInfo = (error: any) => {
    const status = error?.response?.status || error?.code || 500;

    return {
        message: getErrorMessage(error),
        code: status,
        isApiError: error?.success === false,
    };
};
