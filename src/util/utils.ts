import {Chat, ChatInterface, FirestoreQueryOrderBy, FirestoreQueryWhere, Message, MessageInterface, Post, PostInterface} from "./types.distro";
import {v4} from "uuid";
import firebase from "firebase/app";
import "firebase/firestore";
import Compress from "compress.js";

export function getFormattedDate(date: Date): string {
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});
}

export async function getCompressedImages(file: File): Promise<File[]> {
    const compress = new Compress();

    // Compress images
    const imagePromise = compress.compress([file], {
        size: 1, // Size in mb
        maxWidth: 1200,
        maxHeight: 1200,
    });
    const thumbnailPromise = compress.compress([file], {
        size: 0.1,
        maxWidth: 440,
    });

    // Resolve promises
    const [image] = await imagePromise;
    const [thumbnail] = await thumbnailPromise;

    // Convert to files
    const imageBlob = Compress.convertBase64ToFile(image.data, image.ext);
    const thumbnailBlob = Compress.convertBase64ToFile(thumbnail.data, thumbnail.ext);

    // Rename and return files
    const fileName = v4();
    return [new File([imageBlob], `${fileName}.${image.ext.split('/').pop()}`, {type: image.ext}),
        new File([thumbnailBlob], `${fileName}.thumbnail.${image.ext.split('/').pop()}`, {type: image.ext}),
    ];
}

export namespace Query {
    export namespace where {
        export const active: FirestoreQueryWhere = {
            fieldPath: 'active',
            opStr: '==',
            value: true,
        };
        export const hasExpiration = (value: boolean) => ({
            fieldPath: 'hasExpiration',
            opStr: '==',
            value: value,
        } as FirestoreQueryWhere);
        export const unexpired: FirestoreQueryWhere = {
            fieldPath: 'expires',
            opStr: '>',
            value: firebase.firestore.Timestamp.now(),
        };
    }

    export namespace orderByAsc {
        export const created: FirestoreQueryOrderBy = {
            fieldPath: 'created',
            directionStr: 'asc',
        };
        export const expires: FirestoreQueryOrderBy = {
            fieldPath: 'expires',
            directionStr: 'asc',
        };
    }

    export namespace orderByDesc {
        export const created: FirestoreQueryOrderBy = {
            fieldPath: 'created',
            directionStr: 'desc',
        };
        export const expires: FirestoreQueryOrderBy = {
            fieldPath: 'expires',
            directionStr: 'desc',
        };
    }

    // Firestore read rules require some fields to be attached to query
    export namespace includeField {
        export const hasExpiration: FirestoreQueryWhere = {
            fieldPath: 'hasExpiration',
            opStr: 'in',
            value: [true, false],
        };
        export const created: FirestoreQueryWhere = {
            fieldPath: 'created',
            opStr: '!=',
            value: firebase.firestore.Timestamp.now(),
        };
    }
}

export namespace Filters {
    export function unexpired(post: Post) {
        return !post.hasExpiration || (post.expires !== undefined && post.expires > new Date());
    }
}

export namespace Converters {
    export const PostConverter: firebase.firestore.FirestoreDataConverter<Post> = {
        toFirestore(post: PostInterface): firebase.firestore.DocumentData {
            return {
                ...post,
                ...(post.hasExpiration && post.expires && {expires: firebase.firestore.Timestamp.fromDate(post.expires)}),
                created: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Post {
            const data = snapshot.data(options);
            data.id = snapshot.id;
            data.created = data.created ? (data.created as firebase.firestore.Timestamp).toDate() : undefined;
            data.expires = data.expires ? (data.expires as firebase.firestore.Timestamp).toDate() : undefined;
            return new Post(data as Required<PostInterface>);
        },
    };

    export const ChatConverter: firebase.firestore.FirestoreDataConverter<Chat> = {
        toFirestore(chat: ChatInterface): firebase.firestore.DocumentData {
            return {
                ...chat,
                individual: (chat.uids.length <= 2),
                created: firebase.firestore.FieldValue.serverTimestamp(),
                updated: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Chat {
            const data = snapshot.data(options);
            data.id = snapshot.id;
            data.created = data.created ? (data.created as firebase.firestore.Timestamp).toDate() : undefined;
            return new Chat(data as Required<ChatInterface>);
        },
    };

    export const MessageConverter: firebase.firestore.FirestoreDataConverter<Message> = {
        toFirestore(message: MessageInterface): firebase.firestore.DocumentData {
            return {
                ...message,
                created: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): Message {
            const data = snapshot.data(options);
            data.id = snapshot.id;
            data.created = data.created ? (data.created as firebase.firestore.Timestamp).toDate() : undefined;
            return new Message(data as Required<MessageInterface>);
        },
    };
}