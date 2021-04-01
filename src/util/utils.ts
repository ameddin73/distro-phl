import {FirestoreQuery, FirestoreQueryWhere, ItemInterface, ItemTypeInterface, ItemTypes} from "./types";
import {v4} from "uuid";
import firebase from "firebase";

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

export namespace Query {
    export const orderByCreated: FirestoreQuery['orderBy'] = {
        fieldPath: 'created',
        directionStr: 'asc',
    };
    export const whereActive: FirestoreQueryWhere = {
        fieldPath: 'active',
        opStr: '==',
        value: true,
    };
    export const whereNoExpiration: FirestoreQueryWhere = {
        fieldPath: 'hasExpiration',
        opStr: '==',
        value: false,
    };
    export const whereUnexpired: FirestoreQueryWhere = {
        fieldPath: 'expires',
        opStr: '>',
        value: firebase.firestore.Timestamp.now(),
    };
}

export namespace Converters {

    export const itemConverter: firebase.firestore.FirestoreDataConverter<ItemInterface> = {
        toFirestore(item: ItemInterface): firebase.firestore.DocumentData {
            return {
                ...item,
                ...(item.hasExpiration && {expires: firebase.firestore.Timestamp.fromDate(item.expires)}),
                created: firebase.firestore.FieldValue.serverTimestamp(),
            }
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): ItemInterface {
            const data = snapshot.data(options);
            return {
                ...data as ItemInterface,
                id: snapshot.id,
            }
        },
    };
    export const itemTypeConverter: firebase.firestore.FirestoreDataConverter<ItemTypeInterface> = {
        toFirestore(): firebase.firestore.DocumentData {
            throw new Error('Cannot update item types from here.');
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): ItemTypeInterface {
            const data = snapshot.data(options);
            return {
                ...data as ItemTypeInterface,
                id: snapshot.id,
            }
        }
    };
}
