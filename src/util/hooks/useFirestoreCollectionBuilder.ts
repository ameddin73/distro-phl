import {FirestoreQuery, FirestoreQueryWhere} from "../types";
import firebase from "firebase";
import {useFirestore, useFirestoreCollectionData} from "reactfire";

function useFirestoreCollectionBuilder<T>(path: string,
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

export default useFirestoreCollectionBuilder;