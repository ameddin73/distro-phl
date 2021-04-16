import firebase from "firebase/app";
import "firebase/firestore";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";

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
    private readonly documentRef;
    private readonly offersRef: firebase.firestore.CollectionReference;

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

        this.documentRef = firebase.app().firestore().collection(COLLECTIONS.posts).withConverter(Converters.PostConverter).doc(post.id);
        this.offersRef = this.documentRef.collection(COLLECTIONS.offers).withConverter(Converters.OfferConverter);
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
}

export interface Offer {
    id?: string,
    created?: string,
    posterId: string,
    offerId: string,
    userName: string,
    message: string,
}

export class OfferInterface implements Offer {
    readonly id: string;
    readonly created: string;
    readonly posterId: string;
    readonly offerId: string;
    readonly userName: string;
    readonly message: string;

    constructor({id, created, posterId, offerId, userName, message}: Required<Offer>) {
        this.id = id;
        this.created = created;
        this.posterId = posterId;
        this.offerId = offerId;
        this.userName = userName;
        this.message = message;
    }
}