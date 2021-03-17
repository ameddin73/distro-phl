export interface IdMember {
    id: string,
}

export interface ItemInterface extends IdMember {
    readonly active: boolean,
    readonly created: Date,
    readonly description: string,
    readonly expires?: Date,
    readonly imgUrl: string,
    readonly name: string,
    readonly type: string,
    readonly uid: string,
    readonly userName: string,
}

export interface ItemTypeInterface extends IdMember {
    readonly consumable: boolean,
    readonly displayName: string
    readonly expires: boolean,
    readonly index: number,
}

export type RouteType = {
    [key: string]: JSX.Element | (() => JSX.Element),
}