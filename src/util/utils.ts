import {FirestoreQueryOrderBy, FirestoreQueryWhere, Offer, OfferInterface, Post, PostInterface} from "./types";
import {v4} from "uuid";
import firebase from "firebase/app";
import "firebase/firestore";

export function getFileWithUUID(file: File): File {
    Object.defineProperty(file, 'name', {
        writable: true,
        value: file.name.replace(/^[^.]*/, v4()),
    });
    return file;
}

export function getFormattedDate(date: Date): string {
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});
}

export namespace PostQuery {
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

    export namespace orderBy {
        export const created: FirestoreQueryOrderBy = {
            fieldPath: 'created',
            directionStr: 'asc',
        };
        export const expires: FirestoreQueryOrderBy = {
            fieldPath: 'expires',
            directionStr: 'asc',
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

export namespace OfferQuery {
    export namespace where {
        export const userOffer = (value: string) => ({
            fieldPath: 'offerId',
            opStr: '==',
            value: value,
        } as FirestoreQueryWhere);
    }
}

export namespace Filters {
    export function unexpired(post: PostInterface) {
        return !post.hasExpiration || (post.expires !== undefined && post.expires > new Date());
    }
}

export namespace Converters {
    export const PostConverter: firebase.firestore.FirestoreDataConverter<PostInterface> = {
        toFirestore(post: Post): firebase.firestore.DocumentData {
            return {
                ...post,
                ...(post.hasExpiration && post.expires && {expires: firebase.firestore.Timestamp.fromDate(post.expires)}),
                created: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): PostInterface {
            const data = snapshot.data(options);
            data.id = snapshot.id;
            data.created = (data.created as firebase.firestore.Timestamp).toDate();
            data.expires = data.expires ? (data.expires as firebase.firestore.Timestamp).toDate() : undefined;
            return new PostInterface(data as Required<Post>);
        },
    };

    export const OfferConverter: firebase.firestore.FirestoreDataConverter<OfferInterface> = {
        toFirestore(offer: Offer): firebase.firestore.DocumentData {
            return {
                ...offer,
                created: firebase.firestore.FieldValue.serverTimestamp(),
            };
        },
        fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): OfferInterface {
            const data = snapshot.data(options);
            data.id = snapshot.id;
            data.created = (data.created as firebase.firestore.Timestamp).toDate();
            return new OfferInterface(data as Required<Offer>);
        },
    };
}