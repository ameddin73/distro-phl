export namespace UserMocks {
    export type UserType = {
        uid: string,
        name?: string,
        email?: string,
        phone_number?: string,
        password?: string,
    }
    export const defaultUser: UserType = {
        uid: 'yIEcR6DWPlKQ57X8l1xgdxKTiOjn',
        name: 'primary user',
        email: 'primary@gmail.com',
        password: 'primary password',
    }
    export const userTwo: UserType = {
        uid: 'H3STegtgxFqju8CtxBIFN7Qjwmeh',
        name: 'secondary user',
        email: 'secondary@gmail.com',
        password: 'secondary password',
    }
    export const userThree: UserType = {
        uid: 'pYTea318sLYzFG5eDuiB32UTkN3Z',
        name: 'tertiary user',
        email: 'tertiary@gmail.com',
        password: 'tertiary password',
    }
    export const userFour: UserType = {
        uid: 'xj8dSEnEvPtU68nThKD2alSNOW4b',
        name: 'quaternary user',
        email: 'quaternary@gmail.com',
        password: 'quaternary password',
    }
    export const userNameless: UserType = {
        uid: 'tcPsT2sKhQibainWKHWuaFWPXfCU',
        email: 'nameless@gmail.com',
        password: 'nameless password',
    }
}
