import {FirestoreQuery, FirestoreQueryWhere, ItemInterface, ItemTypeInterface, ItemTypes} from "./types";
import {v4} from "uuid";
import firebase from "firebase";

export const orderByCreated: FirestoreQuery['orderBy'] = {
    fieldPath: 'created',
    directionStr: 'asc',
};


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

export const buildFirestoreQuery = (collectionRef: firebase.firestore.CollectionReference,
                                    query?: FirestoreQuery,
                                    converter?: firebase.firestore.FirestoreDataConverter<unknown> | undefined): firebase.firestore.CollectionReference => {
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
    toFirestore(item: Pick<ItemInterface, any>): firebase.firestore.DocumentData {
        return {
            active: item.active,
            created: item.created ? item.created : firebase.firestore.FieldValue.serverTimestamp(),
            description: item.description,
            displayName: item.displayName,
            expires: item.expires,
            image: item.imgUrl,
            type: item.type,
            uid: item.uid,
            userName: item.userName,
        }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): ItemInterface {
        const data = snapshot.data(options);
        return {
            active: data.active,
            created: data.created,
            description: data.description,
            displayName: data.displayName,
            expires: data.expires,
            id: data.id,
            image: data.image,
            type: data.type,
            uid: data.uid,
            userName: data.userName,
        }
    }
}

export const itemTypeConverter = {
    toFirestore(): firebase.firestore.DocumentData {
        throw 'Cannot update item types from here.';
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): ItemTypeInterface {
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
