import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {FirestoreQuery, ItemTypes} from "./types";
import firebase from "firebase";
import {ObservableStatus, useFirestore, useFirestoreCollectionData} from "reactfire";
import {buildFirestoreQuery, buildTypesObject, itemTypeConverter} from "./utils";
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

export const useFirestoreCollectionBuilder = (path: string,
                                              query: FirestoreQuery | undefined,
                                              converter: firebase.firestore.FirestoreDataConverter<unknown> | undefined) => {
    return [
        (): ObservableStatus<any[]> => {
            const firestore = useFirestore();
            const collectionRef = firestore.collection(path);
            const _query = buildFirestoreQuery(collectionRef, query, converter);

            return useFirestoreCollectionData(_query, {idField: 'id'});
        }
    ]
}

export const useItemTypes = () => {
    const path = COLLECTIONS.types;
    const converter = itemTypeConverter;
    const query: FirestoreQuery = {
        where: [],
        orderBy: {
            fieldPath: 'index',
            directionStr: 'asc',
        }
    };
    const [typeObj, setTypeObj] = useState<ItemTypes>({});
    const [getTypes] = useFirestoreCollectionBuilder(path, query, converter);

    useEffect(() => {
        const {data: types} = getTypes()
        setTypeObj(buildTypesObject(types));
    })

    return typeObj;
}

export function useFirestoreUpdate<T>(
    path: string,
    id: string,
    converter: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    const collectionRef = firestore.collection(path);

    return [
        (data: Pick<T, any>) => collectionRef.doc(id).withConverter(converter).update(data)
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