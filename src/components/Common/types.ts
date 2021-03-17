export interface FirestoreMemberInterface {
    id: string,
    readonly displayName: string,
}

export interface ItemInterface extends FirestoreMemberInterface {
    readonly active: boolean,
    readonly created: Date,
    readonly description: string,
    readonly expires?: Date,
    readonly imgUrl: string,
    readonly type: string,
    readonly uid: string,
    readonly userName: string,
}

export interface ItemTypeInterface extends FirestoreMemberInterface {
    readonly consumable: boolean,
    readonly expires: boolean,
    readonly index: number,
}

export type RouteType = {
    [key: string]: JSX.Element | (() => JSX.Element),
}