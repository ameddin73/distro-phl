/**
 * @jest-environment test/jest-env
 */
import {setupFirestore, teardownFirestore} from "./firestoreEmulator";
import {assertSucceeds} from "@firebase/testing";
import firebase from "firebase";
import {COLLECTIONS} from "util/config";
import {buildTypesObject, Converters} from "util/utils";
import {TypesMocks} from "test/mocks/type.mock";
import {ItemTypeInterface} from "util/types";

let db: firebase.firestore.Firestore;

beforeEach(async () => {
    const {firebaseApp} = await setupFirestore()
    db = firebaseApp.firestore();
});
afterEach(teardownFirestore);

it('gets types', async () => {
    const query = db.collection(COLLECTIONS.types).withConverter(Converters.itemTypeConverter);
    assertSucceeds(query.get());
    const querySnapshot = await query.get();
    const typeArray: ItemTypeInterface[] = [];
    querySnapshot.forEach((doc) => typeArray.push(doc.data()));
    const typeObject = buildTypesObject(typeArray);
    expect(typeObject).toMatchObject(TypesMocks.defaultTypes);
});


