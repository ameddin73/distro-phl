export namespace UserMocks {
    export type UserType = {
        uid: string,
        name: string,
        email: string,
    }
    export const defaultUser: UserType = {
        uid: 'default_uid',
        name: 'default_user_displayName',
        email: 'default_email@email.com',
    }
    export const userTwo: UserType = {
        uid: 'test_uid',
        name: 'test_user_displayName',
        email: 'test_email@email.com',
    }
}
