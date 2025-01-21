export const formatErrorMessage = (errorDescription:string, error?: unknown)=>
    error && error instanceof Error
    ? { error: errorDescription, details: error.message }
    : { error: errorDescription, details: 'Unkown error' }