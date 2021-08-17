import firebase from "firebase";
import {apps, clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import {UserMocks} from "mocks/user.mock";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "mocks/post.mock";
import {ChatInterface, PostInterface} from "util/types.distro";
import {firestore} from "firebase-admin/lib/firestore";
import {ChatMocks} from "mocks/chats.mock";
import {Bucket} from "@google-cloud/storage";
import path from "path";
import {readFileSync} from "fs";

const PROJECT = {projectId: process.env.DEMO_PROJECT || ''};
const BUCKET = {storageBucket: "default-bucket"};
const IMAGE = path.resolve("src/test/mocks/1x1.jpeg");

let storageAdmin: Bucket;

export function initFirebase() {
    firebase.initializeApp({
        ...PROJECT,
        ...BUCKET
    });
}

export function destroyFirebase() {
    return Promise.all(apps().map(app => app.delete()))
}

export function startFirestore() {
    function initTestApp(user?: UserMocks.UserType) {
        return initializeTestApp({...PROJECT, auth: user}).firestore();
    }

    const firestoreInstance = initTestApp();
    const firestoreAuth = initTestApp(UserMocks.defaultUser);
    const firestoreAuth2 = initTestApp(UserMocks.userTwo);
    const firestoreAuth3 = initTestApp(UserMocks.userThree);
    const firestoreAuth4 = initTestApp(UserMocks.userFour);
    const firestoreNameless = initTestApp(UserMocks.userNameless);
    const firestoreAdmin = initializeAdminApp(PROJECT).firestore();

    return {firestore: firestoreInstance, firestoreAuth, firestoreAuth2, firestoreAuth3, firestoreAuth4, firestoreNameless, firestoreAdmin};
}

export async function startStorage() {
    const storageInstance = firebase.storage();
    storageInstance.useEmulator("localhost", 9199);
    // const storageInstance = initializeTestApp({
    //     ...PROJECT,
    //     ...BUCKET
    // }).storage();
    const storageAuth = initializeTestApp({
        ...PROJECT,
        ...BUCKET,
        auth: UserMocks.defaultUser
    }).storage();
    storageAdmin = initializeAdminApp({
        ...PROJECT,
        ...BUCKET
    }).storage().bucket(BUCKET.storageBucket);
    // let arraybuffer = Uint8Array.from(Buffer.from(readFileSync(IMAGE))).buffer;
    let arraybuffer = new Uint8Array(readFileSync(IMAGE));
    const blob = new Blob([new Uint8Array(readFileSync(IMAGE))], {
        type: 'image/jpeg'
    });
    // let file = new File([arraybuffer], '1x1.jpeg', {
    //     type: 'image/jpeg'
    // });
    // const a = await storageAuth.ref().child("1x1.jpeg").getMetadata();
    await storageAuth.ref("1x1.jpeg").put(blob);
    // await storageInstance.ref().child("1y1.jpeg").put(arraybuffer);

    // return {storage: storageInstance, storageAuth, storageAdmin};
}

export async function setupFirestore(postMock: boolean, chatMock = false) {
    const firestoreAdmin: firestore.Firestore = initializeAdminApp(PROJECT).firestore();
    if (postMock) await setPosts(firestoreAdmin, PostMocks.defaultPost, PostMocks.secondaryPost);
    if (chatMock) await setChats(firestoreAdmin, ChatMocks.individualChat, ChatMocks.groupChat);
}

export function setupStorage() {
    // Upload with given name
    const doUpload = (name: string) => {
        return storageAdmin.upload(IMAGE, {destination: name});
    }
    // Convenience method for distro-phl naming convention
    const distroName = (name: string) => `images/app/distro-phl_${name}.jpg`;

    return Promise.all([
        doUpload(distroName('1200')),
        doUpload(distroName('480')),
        doUpload(distroName('720')),
        doUpload(distroName('thumbnail')),
    ])
}

export function teardownFirestore() {
    return clearFirestoreData(PROJECT);
}

/**
 * This dinky function is to compensate fo rthe admin SDKs not yet supporting
 * file deletes
 */
export async function teardownStorage() {
    // Delete all files from user
    // const doDelete = (user: )
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
