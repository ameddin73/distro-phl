import firebase from "firebase/app";
import {COLLECTIONS} from "./config";
import {Converters, getFormattedDate} from "./utils";

export type FirestoreQueryWhere = {
    fieldPath: string | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
};
export type FirestoreQueryOrderBy = {
    fieldPath: string | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
};
export type FirestoreQuery = {
    where?: FirestoreQueryWhere[],
    orderBy?: FirestoreQueryOrderBy[],
    limit?: number,
};

export interface Post {
    readonly active: boolean;
    created?: Date;
    description?: string;
    id?: string;
    name?: string;
    hasExpiration: boolean;
    expires?: Date;
    image?: string;
    readonly uid: string;
    readonly userName: string;
}

export class PostInterface implements Post {
    readonly active: boolean;
    readonly created: Date;
    readonly description: string;
    readonly hasExpiration: boolean;
    expires?: Date;
    readonly id: string;
    readonly image: string;
    readonly name: string;
    readonly uid: string;
    readonly userName: string;
    readonly documentRef;
    readonly offersRef: firebase.firestore.CollectionReference;

    constructor(post: Required<Post>) {
        this.active = post.active;
        this.created = post.created;
        this.description = post.description;
        this.name = post.name;
        this.hasExpiration = post.hasExpiration;
        if (post.hasExpiration) {
            this.expires = post.expires;
        } else {
            delete this.expires;
        }
        this.id = post.id;
        this.image = post.image;

        this.documentRef = firebase.app().firestore()
            .collection(COLLECTIONS.posts).withConverter(Converters.PostConverter).doc(post.id);
        this.offersRef = this.documentRef.collection(COLLECTIONS.offers)
            .withConverter(Converters.OfferConverter);
        this.uid = post.uid;
        this.userName = post.userName;
    }

    setActive = (active: boolean): Promise<void> => {
        if (this.documentRef)
            return this.documentRef.update({active});
        return new Promise<void>(() => {
            throw new Error('Document reference not defined.')
        });
    }

    getExpiresAsString = (): string => {
        if (this.expires)
            return getFormattedDate(this.expires);
        throw new Error('Cannot format expires. Post has no expires.');
    }
}

export interface Offer {
    id?: string,
    created?: Date,
    postId: string,
    posterId: string,
    userName: string,
    message: string,
}

export class OfferInterface implements Offer {
    readonly id: string;
    readonly created: Date;
    readonly postId: string;
    readonly posterId: string;
    readonly userName: string;
    readonly message: string;
    readonly documentRef;

    constructor({id, created, postId, posterId, userName, message}: Required<Offer>) {
        this.id = id;
        this.created = created;
        this.postId = postId;
        this.posterId = posterId;
        this.userName = userName;
        this.message = message;

        this.documentRef = firebase.app().firestore().collection(COLLECTIONS.posts)
            .doc(postId).collection(COLLECTIONS.offers)
            .withConverter(Converters.OfferConverter).doc(id);
    }

    getCreatedAsString = (): string => {
        return getFormattedDate(this.created || new Date());
    }
}