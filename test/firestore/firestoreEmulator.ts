import {clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/testing";
import {TypesMocks} from "../mocks/type.mock";
import {ItemTypes} from "util/types";
import setTypes from "./setTypes";

const PROJECT_ID = `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`;

export async function setupFirestore(typesMock: ItemTypes = TypesMocks.defaultTypes) {

    // Monkey hack for some error i never understood https://github.com/electron/electron/issues/12462
    // @ts-ignore
    // setInterval().__proto__.unref = function () {};
    // @ts-ignore
    // setTimeout(function () {}).__proto__.unref = function () {}

    const firebaseApp = initializeTestApp({projectId: PROJECT_ID});
    const firestoreAdmin = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    await setTypes(firestoreAdmin, typesMock);

    return [firebaseApp, firestoreAdmin];
}

export async function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}