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

export interface PostInterface {
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

export class Post implements PostInterface {
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

    constructor(post: Required<PostInterface>) {
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

export interface ChatInterface {
    readonly id?: string,
    readonly created?: Date,
    readonly updated?: Date,
    individual: boolean,
    uids: string[],
    readonly members: {
        uid: string,
        name: string,
    }[];
    name?: string,
    recentMessage?: string,
}

export class Chat implements ChatInterface {
    readonly id: string;
    readonly created: Date;
    readonly updated: Date;
    readonly individual: boolean;
    readonly uids: string[];
    readonly members: {
        uid: string,
        name: string,
    }[];
    readonly name?: string;
    readonly recentMessage?: string;
    readonly documentRef;
    readonly messages: firebase.firestore.CollectionReference;

    constructor({id, created, updated, individual, uids, members, name, recentMessage}: Required<ChatInterface>) {
        this.id = id;
        this.created = created;
        this.updated = updated;
        this.individual = individual;
        this.uids = uids;
        this.members = members;
        this.name = name;
        this.recentMessage = recentMessage;

        this.documentRef = firebase.app().firestore().collection(COLLECTIONS.chats)
            .withConverter(Converters.ChatConverter).doc(id);

        this.messages = this.documentRef.collection(COLLECTIONS.messages)
            .withConverter(Converters.MessageConverter);
    }

    // Create a message in this chat's collection
    sendMessage = async (message: Message) => {
        // Audience must be same as members
        if (message.uids !== this.uids)
            throw new Error('Mismatched audience for new message.')

        await Promise.all([
            // Add message
            this.documentRef.collection(COLLECTIONS.messages).withConverter(Converters.MessageConverter)
                .add(message),
            // Update updated time
            this.documentRef.update({updated: firebase.firestore.FieldValue.serverTimestamp()})
        ])
    }
}

export interface MessageInterface {
    readonly id?: string,
    readonly created?: Date,
    author: string,
    uids: string[],
    text: string,
    postId?: string,
}

export class Message implements MessageInterface {
    readonly id: string;
    readonly created: Date;
    readonly author: string;
    readonly uids: string[];
    readonly text: string;
    readonly postId?: string;
    readonly documentRef;

    constructor({id, created, author, uids, text, postId}: Required<MessageInterface>) {
        this.id = id;
        this.created = created;
        this.author = author;
        this.postId = postId;
        this.uids = uids;
        this.text = text;

        this.documentRef = firebase.app().firestore().collection(COLLECTIONS.messages)
            .withConverter(Converters.MessageConverter).doc(id);
    }

    delete = () => {
        return this.documentRef.delete();
    }
}
