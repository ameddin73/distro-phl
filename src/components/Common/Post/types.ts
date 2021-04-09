import firebase from "firebase";
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

export class PostBuilder implements Post {
    readonly active: boolean;
    description?: string;
    hasExpiration: boolean;
    image?: string;
    name?: string;
    readonly uid: string;
    readonly userName: string;

    constructor({uid, userName}: { uid: string, userName: string }) {
        this.active = true;
        this.hasExpiration = false;
        this.uid = uid;
        this.userName = userName;
    }

    private _expires?: Date;

    get expires(): Date | undefined {
        return this._expires;
    }

    set expires(value: Date | undefined) {
        if (value) {
            this.hasExpiration = true;
            this._expires = value;
        } else {
            this.hasExpiration = false;
            delete this._expires
        }
    }

    isComplete() {
        if (!this.description) return 'Description cannot be empty.';
        if (!this.name) return 'Post name cannot be empty.';
        if (!this.hasExpiration) return 'Must select expiration.';
        if (this.hasExpiration && !this.expires) return 'Expiration cannot be empty.';
        return true;
    }
}

export class PostInterface implements Required<Post> {
    private readonly _active: boolean;
    private readonly _created: Date;
    private readonly _description: string;
    private readonly _hasExpiration: boolean;
    private readonly _id: string;
    private readonly _image: string;
    private readonly _name: string;
    private readonly _uid: string;
    private readonly _userName: string;
    private _collectionRef = firebase.app().firestore().collection(COLLECTIONS.posts).withConverter(Converters.PostConverter);
    private readonly _documentRef;

    constructor(post: Required<Post>) {
        this._active = post.active;
        this._created = post.created;
        this._description = post.description;
        this._name = post.name;
        this._hasExpiration = post.hasExpiration;
        if (post.hasExpiration) {
            this._expires = post.expires;
        } else {
            delete this._expires;
        }
        this._id = post.id;
        this._image = post.image;

        this._documentRef = this._collectionRef.doc(post.id);
        this._uid = post.uid;
        this._userName = post.userName;
    }

    private _expires?: Date;

    get expires(): Date {
        return this._expires as Date;
    }

    get active(): boolean {
        return this._active;
    }

    get created(): Date {
        return this._created;
    }

    get description(): string {
        return this._description;
    }

    get hasExpiration(): boolean {
        return this._hasExpiration;
    }

    get id(): string {
        return this._id;
    }

    get image(): string {
        return this._image;
    }

    get name(): string {
        return this._name;
    }

    get uid(): string {
        return this._uid;
    }

    get userName(): string {
        return this._userName;
    }

    setActive(active: boolean): Promise<void> {
        if (this._documentRef)
            return this._documentRef.update({active});
        return new Promise<void>(() => {
            throw new Error('Document reference not defined.')
        });
    }
}