import firebase from "firebase/app";
import "firebase/firestore";
import {useFirestore} from "reactfire";

function useFirestoreAdd<T>(
    path: string,
    converter: firebase.firestore.FirestoreDataConverter<T>,
    document?: firebase.firestore.DocumentReference) {
    const firestore = useFirestore();
    let collectionRef: firebase.firestore.CollectionReference;
    if (document) {
        collectionRef = document.collection(path);
    } else {
        collectionRef = firestore.collection(path);
    }

    return [
        (data: T) => collectionRef.withConverter(converter).add(data)
    ];
}

export default useFirestoreAdd;