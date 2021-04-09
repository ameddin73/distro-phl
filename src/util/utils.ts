import {FirestoreQuery, FirestoreQueryWhere} from "./types";
import {v4} from "uuid";
import firebase from "firebase";
import {Post, PostBuilder, PostInterface} from "../components/Common/Post/types";

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

    export const PostConverter: firebase.firestore.FirestoreDataConverter<Post> = {
        toFirestore(post: PostBuilder): firebase.firestore.DocumentData {
            return {
                ...post,
                ...(post.hasExpiration && post.expires && {expires: firebase.firestore.Timestamp.fromDate(post.expires)}),
                created: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Post {
            const data = snapshot.data(options);
            return new PostInterface(data as Required<Post>)
        },
    };
}
