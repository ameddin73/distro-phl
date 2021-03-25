import {clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/testing";
import {TypesMocks} from "test/mocks/type.mock";
import {ItemTypes} from "util/types";
import setTypes from "./setTypes";
import firebase from "firebase";

const PROJECT_ID = `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`;

export async function setupFirestore(typesMock: ItemTypes = TypesMocks.defaultTypes) {

    // @ts-ignore
    const firebaseApp: firebase.app.App = initializeTestApp({projectId: PROJECT_ID});
    // @ts-ignore
    const firestoreAdmin: firebase.firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    await setTypes(firestoreAdmin, typesMock);

    return {firebaseApp, firestoreAdmin};
}

export async function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}