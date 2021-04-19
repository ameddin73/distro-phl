import {FirestoreQuery, FirestoreQueryOrderBy, FirestoreQueryWhere} from "../types";
import firebase from "firebase/app";
import {useFirestore, useFirestoreCollectionData} from "reactfire";

function useFirestoreCollectionBuilder<T>(path: string,
                                          query?: FirestoreQuery,
                                          converter?: firebase.firestore.FirestoreDataConverter<T>,
                                          documentRef?: firebase.firestore.DocumentReference) {
    const firestore = useFirestore();
    let _query: firebase.firestore.Query;
    if (documentRef) {
        _query = documentRef.collection(path);
    } else {
        _query = firestore.collection(path);
    }

    if (query) {
        query.where && query.where.forEach((where: FirestoreQueryWhere) =>
            (_query = _query.where(where.fieldPath, where.opStr, where.value)));
        query.orderBy && query.orderBy.forEach((orderBy: FirestoreQueryOrderBy) =>
            (_query = _query.orderBy(orderBy.fieldPath, orderBy.directionStr)));
        if (query.limit) _query = _query.limit(query.limit);
    }

    if (converter) _query = _query.withConverter(converter);

    return useFirestoreCollectionData<T>(_query, {idField: 'id'});
}

export default useFirestoreCollectionBuilder;