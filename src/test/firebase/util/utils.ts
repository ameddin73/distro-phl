import firebase from "firebase";
import {apps, clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import {UserMocks} from "../../mocks/user.mock";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../../mocks/post.mock";
import {ChatInterface, PostInterface} from "util/types.distro";
import {firestore} from "firebase-admin/lib/firestore";
import {ChatMocks} from "../../mocks/chats.mock";

const PROJECT_ID = `${process.env.DEMO_PROJECT}`;

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
    const firestoreAuth4 = initTestApp(UserMocks.userFour);
    const firestoreNameless = initTestApp(UserMocks.userNameless);
    const firestoreAdmin = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    return {firestore: firestoreInstance, firestoreAuth, firestoreAuth2, firestoreAuth3, firestoreAuth4, firestoreNameless, firestoreAdmin};
}

export async function setupFirestore(postMock: boolean, chatMock = false) {
    const firestoreAdmin: firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();
    if (postMock) await setPosts(firestoreAdmin, PostMocks.defaultPost, PostMocks.secondaryPost);
    if (chatMock) await setChats(firestoreAdmin, ChatMocks.individualChat, ChatMocks.groupChat);
}

export function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}

export async function teardownFirebase() {
    for (const app of apps()) {
        await app.delete();
    }
}

async function setPosts(firestoreAdmin: firestore.Firestore, mock: PostInterface, mock2: PostInterface) {
    for (let i: number = 0; i < 5; i++) { // @ts-ignore
        await firestoreAdmin.collection(COLLECTIONS.posts).doc('preset-post-' + i).set(mock);
    }
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(mock2.id || '').set(mock2);
}

async function setChats(firestoreAdmin: firestore.Firestore, mock: ChatInterface, mock2: ChatInterface) {
    await firestoreAdmin.collection(COLLECTIONS.chats).doc(mock.id || '').set(mock);
    await firestoreAdmin.collection(COLLECTIONS.chats).doc(mock2.id || '').set(mock2);
}
