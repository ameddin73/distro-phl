export interface ItemInterface {
    readonly active: boolean,
    readonly created: Date,
    readonly description: string,
    readonly expires?: Date,
    readonly id: string,
    readonly imgUrl: string,
    readonly name: string,
    readonly type: string,
    readonly uid: string,
    readonly userName: string,
}

export interface ItemTypeInterface {
    readonly consumable: boolean,
    readonly displayName: string
    readonly expires: boolean,
    readonly id: string,
    readonly index: number,
}

export type RouteType = {
    [key: string]: JSX.Element | (() => JSX.Element),
}