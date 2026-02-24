export const success = <T>(data: T) => ({ success: true, data });
export const error = (message: string, code: number = 400) => ({ success: false, error: message, code });
