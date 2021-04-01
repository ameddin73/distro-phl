import {TypesMocks} from "test/mocks/type.mock";
import {ItemInterface, ItemTypeInterface, ItemTypes} from "util/types";
import {clearFirestoreData, initializeAdminApp, initializeTestApp} from "@firebase/rules-unit-testing";
import firebase from "firebase";
import {UserMocks} from "../mocks/user.mock";
import {Mutable} from "../types";
import {COLLECTIONS} from "util/config";
import {ItemMocks} from "../mocks/item.mock";
import _ from "lodash";
import {firestore} from "firebase-admin/lib/firestore";

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

export async function setupFirestore(typesMock: boolean, itemMock: boolean) {
    const firestoreAdmin: firebase.firestore.Firestore = initializeAdminApp({projectId: PROJECT_ID}).firestore();
    if (typesMock) await setTypes(firestoreAdmin, TypesMocks.defaultTypes);
    if (itemMock) await setItems(firestoreAdmin, ItemMocks.defaultItem, ItemMocks.secondaryItem);
}

export function teardownFirestore() {
    return clearFirestoreData({projectId: PROJECT_ID});
}

async function setItems(firestoreAdmin: firebase.firestore.Firestore, mock: ItemInterface, mock2: ItemInterface) {
    for (let i: number = 0; i < 5; i++) { // @ts-ignore
        await firestoreAdmin.collection(COLLECTIONS.items).withConverter(testItemConverter).doc('preset-item-' + i).set(mock);
    }
    await firestoreAdmin.collection(COLLECTIONS.items).withConverter(testItemConverter).doc(mock2.id).set(mock2);
}

async function setTypes(firestoreAdmin: firebase.firestore.Firestore, mock: ItemTypes) {
    for (const mockType of Object.values(mock)) {
        const id = mockType.id;
        const mocDoc: Mutable<ItemTypeInterface> = _.clone(mockType);
        delete mocDoc.id;
        await firestoreAdmin.collection(COLLECTIONS.types).doc(id).set(mocDoc);
    }
}

// This is a copy of itemConverter from src/utils that uses the firebase-admin firestore instance
// because of an incompatibility between FieldData types. See more here:
// https://github.com/googleapis/nodejs-firestore/issues/760#issuecomment-643006776
// Not sure what to do in terms of keeping this up to date.
// TODO Could be a huge maintenance problem. Env var?
export const testItemConverter: firebase.firestore.FirestoreDataConverter<ItemInterface> = {
    toFirestore(item: ItemInterface): firebase.firestore.DocumentData {
        return {
            ...item,
            ...(item.hasExpiration && {expires: firestore.Timestamp.fromDate(item.expires)}),
            created: firestore.FieldValue.serverTimestamp(),
        }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): ItemInterface {
        const data = snapshot.data(options);
        return {
            ...data as ItemInterface,
            ...(data.hasExpiration && {expires: data.expires.toDate()}),
            created: data.created.toDate(),
            id: snapshot.id,
        }
    },
};