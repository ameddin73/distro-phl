import {FirestoreMember, FirestoreQuery, FirestoreQueryWhere, ItemInterface, ItemTypeInterface, ItemTypes} from "./types";
import {v4} from "uuid";
import firebase from "firebase";
import CollectionReference = firebase.firestore.CollectionReference;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import SnapshotOptions = firebase.firestore.SnapshotOptions;
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import DocumentData = firebase.firestore.DocumentData;

export function bindIds<T>(makeObject: boolean, ids: string[], values: T[]): T[];
export function bindIds<T>(makeObject: boolean, ids: string[], values: T[]): { [key: string]: T };
export function bindIds<T extends FirestoreMember>(makeObject: boolean, ids: string[], values: T[]):
    { [key: string]: T } | T[] {
    if (makeObject) {
        const object: { [key: string]: T } = {};
        values.forEach((itemType: T, index: number) => (object[ids[index]] = itemType));
        return object;
    } else {
        values.map((item: T, index: number) => (item.id = ids[index]));
        return values;
    }
}

export function buildTypesObject(types: ItemTypeInterface[]): ItemTypes {
    const object: { [key: string]: ItemTypeInterface } = {};
    types.forEach((type: ItemTypeInterface) => (object[type.id] = type));
    return object;
}

export const getFileWithUUID = (file: File): File => {
    Object.defineProperty(file, 'name', {
        writable: true,
        value: file.name.replace(/^[^.]*/, v4()),
    });
    return file;
}

export const buildFirestoreQuery = (collectionRef: CollectionReference,
                                    query?: FirestoreQuery,
                                    converter?: FirestoreDataConverter<unknown> | undefined): CollectionReference => {
    if (query) {
        query.where.forEach((where: FirestoreQueryWhere) =>
            (collectionRef.where(where.fieldPath, where.opStr, where.value)));
        if (query.orderBy) collectionRef.orderBy(query.orderBy.fieldPath, query.orderBy.directionStr);
        if (query.limit) collectionRef.limit(query.limit);
    }
    if (converter) collectionRef.withConverter(converter);
    return collectionRef;
}

export const itemConverter = {
    toFirestore(item: ItemInterface): DocumentData {
        return {
            active: item.active,
            created: item.created,
            description: item.description,
            displayName: item.displayName,
            expires: item.expires,
            id: item.id,
            imgUrl: item.imgUrl,
            type: item.type,
            uid: item.uid,
            userName: item.userName,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ItemInterface {
        const data = snapshot.data(options);
        return {
            active: data.active,
            created: data.created,
            description: data.description,
            displayName: data.displayName,
            expires: data.expires,
            id: data.id,
            imgUrl: data.imgUrl,
            type: data.type,
            uid: data.uid,
            userName: data.userName,
        }
    }
}

export const itemTypeConverter = {
    toFirestore(type: ItemTypeInterface): DocumentData {
        return {
            consumable: type.consumable,
            displayName: type.displayName,
            expires: type.expires,
            id: type.id,
            index: type.index,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ItemTypeInterface {
        const data = snapshot.data(options);
        return {
            consumable: data.consumable,
            displayName: data.displayName,
            expires: data.expires,
            id: data.id,
            index: data.index,
        }
    }
}
