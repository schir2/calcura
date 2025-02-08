export interface User {
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    permissions: string[],
    is_staff: boolean,
    is_active: boolean,
    is_superuser: boolean,
    groups: string[],
}