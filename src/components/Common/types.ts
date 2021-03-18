import {RunMutation} from "@react-firebase/firestore/dist/components/FirestoreMutation";

export type FirestoreMember = {
    id?: string,
    readonly displayName: string,
}

// This trick creates a type wrapper that allows you to strictly prohibit undefined
// keys as per: https://stackoverflow.com/a/57117594/3434441
type Prevent<K extends keyof any> = {
    [P in K]: never;
}
type NoExtraProperties<T, U extends T = T> = U & Prevent<Exclude<keyof U, keyof T>>;

interface ItemKeys extends FirestoreMember {
    readonly active: boolean,
    readonly created: Date,
    readonly description: string,
    readonly expires?: Date,
    readonly imgUrl: string,
    readonly type: string,
    readonly uid: string,
    readonly userName: string,
}

export type ItemInterface = NoExtraProperties<ItemKeys>;

export interface ItemType extends FirestoreMember {
    readonly consumable: boolean,
    readonly expires: boolean,
    readonly index: number,
}

export type ItemMutation = RunMutation extends (value: any, ...rest: infer U) => infer R
    ? (value: ItemInterface, ...rest: U) => R : never;

export type ItemTypes = {
    [key: string]: ItemType,
}

export type RouteType = {
    [key: string]: JSX.Element | (() => JSX.Element) | (() => (arg0: any) => JSX.Element),
}