// Converts boolean in query string to boolean value
export const queryBool = (str: string): boolean =>
    !!str && str.toString().trim().toLowerCase() === 'true';
