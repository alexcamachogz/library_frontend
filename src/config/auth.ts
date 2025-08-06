export const AUTHORIZED_EMAILS = [
    'camacho.ale94@gmail.com',
    'marielml90@gmail.com'
] as const;

export type AuthorizedEmail = typeof AUTHORIZED_EMAILS[number];
/**
 * Verifica si un email está autorizado para acceder a la aplicación
 */
export const isEmailAuthorized = (email: string): boolean => {
    return AUTHORIZED_EMAILS.includes(email as AuthorizedEmail);
};

/**
 * Obtiene el nombre de usuario basado en el email autorizado
 */
export const getUserDisplayName = (email: string): string => {
    switch (email) {
        case 'camacho.ale94@gmail.com':
            return 'Alex';
        case 'marielml90@gmail.com':
            return 'Mariel';
        default:
            return 'Usuario';
    }
};