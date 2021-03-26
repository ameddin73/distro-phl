export namespace UserMocks {
    export type UserType = {
        uid: string,
        name: string,
        email: string,
    }
    export const defaultUser: UserType = {
        uid: 'default_uid',
        name: 'default_user_displayName',
        email: 'default_email',
    }
}
