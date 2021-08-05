import {useFirestore, useFirestoreDocData} from "reactfire";
import firebase from "firebase/app";

function useFirestoreDocumentBuilder<T>(collection: string,
                                        id?: string,
                                        converter?: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    let ref = firestore.collection(collection).doc(id);
    if (converter) ref = ref.withConverter(converter);

    return useFirestoreDocData<T>(ref);
}

export default useFirestoreDocumentBuilder;