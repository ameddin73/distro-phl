/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {getFirestoreUser, setupFirestore, startFirestore, teardownFirestore} from "./firestoreEmulator";
import {COLLECTIONS} from "util/config";
import {buildTypesObject, Converters} from "util/utils";
import {TypesMocks} from "test/mocks/type.mock";
import {ItemInterface, ItemTypeInterface} from "util/types";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {ItemMocks} from "../mocks/item.mock";
import {Mutable} from "../types";
import firebase from "firebase";
import _ from "lodash";

let firestore: firebase.firestore.Firestore;
let firestoreAuth: firebase.firestore.Firestore;
let firestoreAdmin: firebase.firestore.Firestore;
let unsubscribe = () => {
};

describe('testing framework', () => {

    beforeAll(async () => {
        const stores = await startFirestore();
        firestore = stores.firestore;
        firestoreAdmin = stores.firestoreAdmin;
    })
    beforeEach(async () => await setupFirestore(firestoreAdmin));
    afterEach(() => {
        unsubscribe();
        teardownFirestore();
    });
    afterAll(teardownFirestore);

    it('tests populates types', done => {
        const query = firestore.collection(COLLECTIONS.types).withConverter(Converters.itemTypeConverter);

        testCollection(query, (data: ItemTypeInterface[]) => {
            const typeObject = buildTypesObject(data);
            expect(typeObject).toMatchObject(TypesMocks.defaultTypes);
            done()
        })
    });

    it('tests populates items', done => {
        const testItem: Mutable<ItemInterface> = ItemMocks.defaultItem;
        delete testItem.created;
        delete testItem.expires;

        const query = firestore.collection(COLLECTIONS.items).withConverter(Converters.itemConverter);

        testCollection(query, (data: ItemInterface[]) => {
            expect(data.length).toBe(5);
            data.forEach((item, index) => {
                testItem.id = 'preset-item-' + index;
                expect(item).toMatchObject(testItem)
            });
            done()
        })
    });
});

describe('post an item', () => {
    const mockItem = ItemMocks.defaultItem;
    const mocDoc: Mutable<ItemInterface> = _.clone(mockItem);
    delete mocDoc.id;
    delete mocDoc.created;

    let query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    let queryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    let queryAuthed2: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

    beforeAll(async () => {
        const stores = await startFirestore();
        firestore = stores.firestore;
        firestoreAuth = stores.firestoreAuth;
        firestoreAdmin = stores.firestoreAdmin;

        query = firestore.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);
        queryAuthed = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);

        await setupFirestore(firestoreAdmin)
    })
    afterEach(unsubscribe);
    afterAll(teardownFirestore);

    it('tests uid rule', async () => {
        const firestoreAuth2 = getFirestoreUser({uid: 'test-uid'});
        queryAuthed2 = firestoreAuth2.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);

        // await assertFails(query.set(mocDoc));
        // await assertFails(queryAuthed2.set(mocDoc));
        await assertSucceeds(queryAuthed.set(mocDoc));
    });

    it('tests displayName rule', async () => {
        const firestoreAuth2 = getFirestoreUser({name: 'test-name'});
        queryAuthed2 = firestoreAuth2.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);

        await assertFails(queryAuthed2.set(mocDoc));
        await assertSucceeds(queryAuthed.set(mocDoc));
    });

    it('tests update an item', async () => {
    });
});

function testCollection<T>(query: firebase.firestore.Query, executor: (data: Array<T>) => void) {
    expect.hasAssertions();
    assertSucceeds(query.get()).then(() => {
        unsubscribe = query.onSnapshot((querySnapshot) => {
            const data: Array<T> = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as T);
            });
            if (data.length > 0) executor(data);
        });
    });
}
