import firebase from "firebase";
import {apps, clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import {UserMocks} from "../mocks/user.mock";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../mocks/post.mock";
import {Post} from "../../components/Common/Post/types";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;

export function startFirestore() {
    const firestore: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID}).firestore();
    const firestoreAuth: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.defaultUser.uid, name: UserMocks.defaultUser.name, email: UserMocks.defaultUser.email}}).firestore();
    const firestoreAuth2: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.userTwo.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
    const firestoreAdmin: firebase.firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    return {firestore, firestoreAuth, firestoreAuth2, firestoreAdmin};
}

export function getFirestoreUser({uid = UserMocks.defaultUser.uid, name = UserMocks.defaultUser.name, email = UserMocks.defaultUser.email}: { uid?: string, name?: string, email?: string }) {
    return initializeTestApp({projectId: PROJECT_ID, auth: {uid: uid, name: name, email: email}}).firestore();
}

export async function setupFirestore(typesMock: boolean, postMock: boolean) {
    const firestoreAdmin: firebase.firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();
    if (postMock) await setPosts(firestoreAdmin, PostMocks.defaultPost, PostMocks.secondaryPost);
}

export function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}

export async function teardownFirebase() {
    for (const app of apps()) {
        await app.delete();
    }
}

async function setPosts(firestoreAdmin: firebase.firestore.Firestore, mock: Post, mock2: Post) {
    for (let i: number = 0; i < 5; i++) { // @ts-ignore
        await firestoreAdmin.collection(COLLECTIONS.posts).doc('preset-post-' + i).set(mock);
    }
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(mock2.id).set(mock2);
}