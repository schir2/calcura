export interface User {
    username?: string,
    email: string,
    firstName?: string,
    lastName?: string,
    groups: string[],
    isStaff: boolean,
    isActive: boolean,
    isSuperuser: boolean,
}