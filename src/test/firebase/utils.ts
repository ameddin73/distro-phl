import firebase from "firebase";
import {apps, clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import {UserMocks} from "../mocks/user.mock";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../mocks/post.mock";
import {Offer, Post} from "util/types.distro";
import _ from "lodash";
import {Mutable} from "../types";
import {OfferMocks} from "../mocks/offer.mock";
import {firestore} from "firebase-admin/lib/firestore";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;

export function initFirebase() {
    firebase.initializeApp({projectId: PROJECT_ID});
}

export async function destroyFirebase() {
    await firebase.app().delete();
}

export function startFirestore() {
    function initTestApp(user?: UserMocks.UserType) {
        return initializeTestApp({projectId: PROJECT_ID, auth: user}).firestore();
    }

    const firestoreInstance = initTestApp();
    const firestoreAuth = initTestApp(UserMocks.defaultUser);
    const firestoreAuth2 = initTestApp(UserMocks.userTwo);
    const firestoreAuth3 = initTestApp(UserMocks.userThree);
    const firestorePhone = initTestApp(UserMocks.userPhone);
    const firestoreAdmin = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    return {firestore: firestoreInstance, firestoreAuth, firestoreAuth2, firestoreAuth3, firestorePhone, firestoreAdmin};
}

export async function setupFirestore(postMock: boolean, offerMock?: boolean) {
    const firestoreAdmin: firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();
    if (postMock) await setPosts(firestoreAdmin, PostMocks.defaultPost, PostMocks.secondaryPost);
    if (offerMock) await setOffers(firestoreAdmin);
}

export function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}

export async function teardownFirebase() {
    for (const app of apps()) {
        await app.delete();
    }
}

async function setPosts(firestoreAdmin: firestore.Firestore, mock: Post, mock2: Post) {
    for (let i: number = 0; i < 5; i++) { // @ts-ignore
        await firestoreAdmin.collection(COLLECTIONS.posts).doc('preset-post-' + i).set(mock);
    }
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(mock2.id || '').set(mock2);
}

async function setOffers(firestoreAdmin: firestore.Firestore) {
    const post: Mutable<Post> = _.clone(PostMocks.defaultPost);
    delete post.id;
    const postRef = firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id);
    await postRef.set(post);

    const offers: Mutable<Offer>[] = [_.clone(OfferMocks.defaultOffer), _.clone(OfferMocks.secondaryOffer)]
    for (const offer of offers) {
        const id = offer.id;
        delete offer.id;
        await postRef.collection(COLLECTIONS.offers).doc(id || '').set(offer);
    }
}
