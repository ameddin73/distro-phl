import firebase from "firebase/app";
import {useFirestore} from "reactfire";

function useFirestoreUpdate<T>(
    path: string,
    id: string,
    converter: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    const collectionRef = firestore.collection(path);

    return (data: Partial<T>) => collectionRef.doc(id).withConverter(converter).update(data);
}

export default useFirestoreUpdate;