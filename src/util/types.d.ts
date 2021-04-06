import firebase from "firebase";
import FieldPath = firebase.firestore.FieldPath;
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;

export type FirestoreQueryWhere = {
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
}
export type FirestoreQuery = {
    where: FirestoreQueryWhere[],
    orderBy?: {
        fieldPath: string | FieldPath,
        directionStr?: OrderByDirection
    },
    limit?: number,
}
export type FirestoreMember = {
    readonly id: string,
    displayName: string,
}

// This trick creates a type wrapper that allows you to strictly prohibit undefined
// keys as per: https://stackoverflow.com/a/57117594/3434441
type Prevent<K extends keyof any> = {
    [P in K]: never;
}
type NoExtraProperties<T, U extends T = T> = U & Prevent<Exclude<keyof U, keyof T>>;

interface ItemKeys extends FirestoreMember {
    active: boolean,
    readonly created: Date,
    description: string,
    image: string,
    type: ItemTypeInterface['id'],
    readonly uid: string,
    userName: string,
}

interface ItemWithExpiration extends ItemKeys {
    hasExpiration: true,
    expires: Date,
}

interface ItemNoExpiration extends ItemKeys {
    hasExpiration: false,
}

export type ItemInterface = NoExtraProperties<ItemWithExpiration | ItemNoExpiration>;

export interface ItemTypeInterface extends FirestoreMember {
    readonly consumable: boolean,
    readonly expires: boolean,
    readonly id: string,
    readonly index: number,
}

export type ItemTypes = {
    [key: string]: ItemTypeInterface,
}