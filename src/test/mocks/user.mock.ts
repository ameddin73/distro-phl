export namespace UserMocks {
    export type UserType = {
        uid: string,
        displayName: string,
        email: string,
    }
    export const defaultUser: UserType = {
        uid: 'default_uid',
        displayName: 'default_user_displayName',
        email: 'default_email',
    }
}
