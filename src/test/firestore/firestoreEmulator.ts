import {TypesMocks} from "test/mocks/type.mock";
import {ItemInterface, ItemTypeInterface, ItemTypes} from "util/types";
import {clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import firebase from "firebase";
import {UserMocks} from "../mocks/user.mock";
import {Mutable} from "../types";
import {COLLECTIONS} from "../../util/config";
import {ItemMocks} from "../mocks/item.mock";
import _ from "lodash";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;

export async function startFirestore() {
    const firestore: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID}).firestore();
    const firestoreAuth: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.defaultUser.uid, email: UserMocks.defaultUser.email}}).firestore();
    const firestoreAdmin: firebase.firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    return {firestore, firestoreAuth, firestoreAdmin};
}

export async function setupFirestore(firestoreAdmin: firebase.firestore.Firestore, typesMock: ItemTypes | null = TypesMocks.defaultTypes, itemMock: ItemInterface | null = ItemMocks.defaultItem) {
    if (typesMock !== null) await setTypes(firestoreAdmin, typesMock);
    if (itemMock !== null) await setItems(firestoreAdmin, itemMock);
}

export async function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}

async function setItems(firestoreAdmin: firebase.firestore.Firestore, mock: ItemInterface) {
    const mocDoc: Mutable<ItemInterface> = _.clone(mock);
    delete mocDoc.id;
    for (let i: number = 0; i < 5; i++) await firestoreAdmin.collection(COLLECTIONS.items).doc('preset-item-' + i).set(mocDoc);
}

async function setTypes(firestoreAdmin: firebase.firestore.Firestore, mock: ItemTypes) {
    for (const mockType of Object.values(mock)) {
        const id = mockType.id;
        const mocDoc: Mutable<ItemTypeInterface> = _.clone(mockType);
        delete mocDoc.id;
        await firestoreAdmin.collection(COLLECTIONS.types).doc(id).set(mocDoc);
    }
}
