import firebase from "firebase/app";
import "firebase/firestore";
import {useFirestore} from "reactfire";

function useFirestoreAdd<T>(
    path: string,
    converter: firebase.firestore.FirestoreDataConverter<T>) {
    const firestore = useFirestore();
    let collectionRef = firestore.collection(path);

    return [
        (data: T) => collectionRef.withConverter(converter).add(data)
    ];
}

export default useFirestoreAdd;