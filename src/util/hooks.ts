import {ChangeEvent, SyntheticEvent, useState} from "react";
import {FirestoreQuery, FirestoreQueryWhere} from "./types";
import firebase from "firebase";
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {buildTypesObject, Converters} from "./utils";
import {COLLECTIONS} from "./config";

export const useInput = (initialValue?: any) => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event: SyntheticEvent | ChangeEvent<{ name?: string; value: unknown }>) => setValue((event.target as HTMLInputElement).value),
        }
    };
};

export function useFirestoreCollectionBuilder<T>(path: string,
                                                 query: FirestoreQuery | undefined,
                                                 converter: firebase.firestore.FirestoreDataConverter<T> | undefined) {
    const firestore = useFirestore();
    let _query: firebase.firestore.Query = firestore.collection(path);

    if (query) {
        query.where.forEach((where: FirestoreQueryWhere) =>
            (_query = _query.where(where.fieldPath, where.opStr, where.value)));
        if (query.orderBy) _query = _query.orderBy(query.orderBy.fieldPath, query.orderBy.directionStr);
        if (query.limit) _query = _query.limit(query.limit);
    }

    if (converter) _query = _query.withConverter(converter);

    return useFirestoreCollectionData<T>(_query, {idField: 'id'});
}

export const useItemTypes = () => {
    const path = COLLECTIONS.types;
    const converter = Converters.itemTypeConverter;
    const query: FirestoreQuery = {
        where: [],
        orderBy: {
            fieldPath: 'index',
            directionStr: 'asc',
        }
    };

    const {data: types} = useFirestoreCollectionBuilder(path, query, converter);
    return buildTypesObject(types);
}

export function useFirestoreUpdate<T>(
    path: string,
    id: string,
    converter: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    const collectionRef = firestore.collection(path);

    return [
        (data: Partial<T>) => collectionRef.doc(id).withConverter(converter).update(data)
    ];
}

export function useFirestoreAdd<T>(
    path: string,
    converter: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    const collectionRef = firestore.collection(path);

    return [
        (data: T) => collectionRef.withConverter(converter).add(data)
    ];
}

export const uploadImage = {};