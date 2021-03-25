/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {setupFirestore, startFirestore, teardownFirestore} from "./firestoreEmulator";
import {COLLECTIONS} from "util/config";
import {buildTypesObject, Converters} from "util/utils";
import {TypesMocks} from "test/mocks/type.mock";
import {ItemInterface, ItemTypeInterface} from "util/types";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {ItemMocks} from "../mocks/item.mock";
import {Mutable} from "../types";
import firebase from "firebase";


describe('testing framework', () => {
    let firestore: firebase.firestore.Firestore;
    let firestoreAdmin: firebase.firestore.Firestore;

    beforeAll(async () => {
        const stores = await startFirestore();
        firestore = stores.firestore;
        firestoreAdmin = stores.firestoreAdmin;
    })
    beforeEach(async () => await setupFirestore(firestoreAdmin));
    afterEach(teardownFirestore);

    function runTest<T>(query: firebase.firestore.Query, data: Array<T>, executor: (data: Array<T>) => void) {
        expect.hasAssertions();
        assertSucceeds(query.get()).then(() => {
            query.onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push(doc.data() as T);
                })
                return executor(data)
            });
        });
    }

    it('tests adding types', done => {
        const query = firestore.collection(COLLECTIONS.types).withConverter(Converters.itemTypeConverter);
        const typeArray: ItemTypeInterface[] = [];

        runTest(query, typeArray, (data: typeof typeArray) => {
            const typeObject = buildTypesObject(data);
            expect(typeObject).toMatchObject(TypesMocks.defaultTypes);
            done()
        })
    });

    it('tests adding items', done => {
        const testItem: Mutable<ItemInterface> = ItemMocks.defaultItem;
        delete testItem.created;
        delete testItem.expires;

        const query = firestore.collection(COLLECTIONS.items).withConverter(Converters.itemConverter);
        const itemArray: ItemInterface[] = [];

        runTest(query, itemArray, (data: typeof itemArray) => {
            expect(itemArray.length).toBe(5);
            itemArray.forEach((item, index) => {
                testItem.id = 'preset-item-' + index;
                expect(item).toMatchObject(testItem)
            });
            done()
        })
    });
})

describe('item rules', () => {
    let firestore: firebase.firestore.Firestore;
    let firestoreAuth: firebase.firestore.Firestore;
    let firestoreAdmin: firebase.firestore.Firestore;

    beforeAll(async () => {
        const stores = await startFirestore();
        firestore = stores.firestore;
        firestoreAuth = stores.firestore;
        firestoreAdmin = stores.firestoreAdmin;
        await setupFirestore(firestoreAdmin)
    })
    afterAll(teardownFirestore);

    it('tests posting an item', async () => {
        const mockItem = ItemMocks.defaultItem;
        const mocDoc: Mutable<ItemInterface> = mockItem;
        delete mocDoc.id;

        const query = firestore.collection(COLLECTIONS.items).doc(mockItem.id)
        const queryAuthed = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id)
        await assertFails(query.set(mocDoc));
        await assertSucceeds(queryAuthed.set(mocDoc));
    });


})
