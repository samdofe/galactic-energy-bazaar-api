export const formatErrorMessage = (errorDescription:string, error?: unknown)=>
    error && error instanceof Error
    ? { error: errorDescription, details: error.message }
    : { error: errorDescription, details: 'Unkown error' };

export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
};