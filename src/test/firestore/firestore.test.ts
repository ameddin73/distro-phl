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
import _ from "lodash";

let firestore: firebase.firestore.Firestore;
let firestoreAuth: firebase.firestore.Firestore;
let unsubscribe = () => {
};
const mockItem = ItemMocks.defaultItem;
const mocDoc: Mutable<ItemInterface> = _.clone(mockItem);
delete mocDoc.id;
delete mocDoc.created;

let query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let updateQueryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

describe('testing framework', () => {

    beforeAll(async () => {
        const stores = await startFirestore();
        firestore = stores.firestore;
    })
    beforeEach(async () => await setupFirestore(true, true));
    afterEach(async () => {
        unsubscribe();
        await teardownFirestore();
    });
    afterAll(async () => await teardownFirestore);

    it('tests populates types', done => {
        const query = firestore.collection(COLLECTIONS.types).withConverter(Converters.itemTypeConverter);

        testCollection(query, (data: ItemTypeInterface[]) => {
            const typeObject = buildTypesObject(data);
            expect(typeObject).toMatchObject(TypesMocks.defaultTypes);
            done()
        })
    });

    it('tests populates items', done => {
        const testItem: Mutable<ItemInterface> = _.clone(ItemMocks.defaultItem);
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

describe('create item rules', () => {
    beforeAll(async () => {
        await buildFirestore();
    });
    beforeEach(async () => await setupFirestore(true, false));
    afterEach(async () => {
        await teardownFirestore();
    });

    it('tests creating a valid item', async () => {
        await assertSucceeds(queryAuthed.set(mocDoc));
    });

    it('tests types are valid', async () => {
        let testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        // @ts-ignore
        testDoc.active = 'string';
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.created = 'string';
        await assertFails(firestoreAuth.collection(COLLECTIONS.items).doc('test').set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.description = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.displayName = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.expires = 'string';
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.image = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.image = 'ill-formatted string';
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.type = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.uid = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.userName = true;
        await assertFails(queryAuthed.set(testDoc));
    });

    it('tests hasAll rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        delete testDoc.description;
        const testQuery = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);
        await assertFails(testQuery.set(testDoc));
    });

    it('tests hasOnly rule', async () => {
        const testDoc: Mutable<ItemInterface & { test: string }> = _.clone(mocDoc);
        testDoc.test = 'test';
        const testQueryFail = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);
        await assertFails(testQueryFail.set(testDoc));
    });

    it('tests uidEqual rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.uid = 'test uid';
        await assertFails(query.set(testDoc));
        await assertFails(queryAuthed.set(testDoc));
        testDoc.uid = ItemMocks.defaultItem.uid;
        await assertSucceeds(queryAuthed.set(testDoc));
    });

    it('tests nameEqual rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.userName = 'test name';

        await assertFails(queryAuthed.set(testDoc));
    });

    it('tests activeTrue rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.active = false;

        const testQuery = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);

        await assertFails(testQuery.set(testDoc));
    });

    it('tests createdNow rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')

        const testQuery = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);

        await assertFails(testQuery.set(testDoc));

        // @ts-ignore
        testDoc.created = firebase.firestore.FieldValue.serverTimestamp();
        await assertSucceeds(testQuery.set(testDoc));
    });

    it('tests expiresLater rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')

        await assertFails(query.set(testDoc));
    });

    it('tests typeExists rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.type = 'test'

        await assertFails(query.set(testDoc));
    });
});

describe('update item rules', () => {
    beforeAll(async () => {
        await buildFirestore();
    });
    beforeEach(async () => {
        await setupFirestore(true, false);
        await queryAuthed.set(mocDoc);
    });
    afterEach(async () => {
        await teardownFirestore();
    });

    it('tests a valid update', async () => {
        await assertSucceeds(updateQueryAuthed.update({active: false}));
    });

    it('tests types are valid', async () => {
        await assertFails(updateQueryAuthed.update({active: 'string'}));
        await assertFails(updateQueryAuthed.update({description: true}));
        await assertFails(updateQueryAuthed.update({displayName: true}));
        await assertFails(updateQueryAuthed.update({expires: true}));
        await assertFails(updateQueryAuthed.update({image: true}));
        await assertFails(updateQueryAuthed.update({image: 'ill-formatted string'}));
        await assertFails(updateQueryAuthed.update({type: true}));
        await assertFails(updateQueryAuthed.update({userName: true}));
    });

    it('tests hasOnly rule', async () => {
        await assertFails(updateQueryAuthed.update({created: new Date()}));
    });

    it('tests uidEqual rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.uid = 'test uid';
        await assertFails(query.set(testDoc));
        await assertFails(queryAuthed.set(testDoc));
        testDoc.uid = ItemMocks.defaultItem.uid;
        await assertSucceeds(queryAuthed.set(testDoc));
    });

    it('tests nameEqual rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.userName = 'test name';

        await assertFails(queryAuthed.set(testDoc));
    });

    it('tests activeTrue rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.active = false;

        const testQuery = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);

        await assertFails(testQuery.set(testDoc));
    });

    it('tests createdNow rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')

        const testQuery = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);

        await assertFails(testQuery.set(testDoc));

        // @ts-ignore
        testDoc.created = firebase.firestore.FieldValue.serverTimestamp();
        await assertSucceeds(testQuery.set(testDoc));
    });

    it('tests expiresLater rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')

        await assertFails(query.set(testDoc));
    });

    it('tests typeExists rule', async () => {
        const testDoc: Mutable<ItemInterface> = _.clone(mocDoc);
        testDoc.type = 'test'

        await assertFails(query.set(testDoc));
    });
});

async function buildFirestore() {
    const stores = await startFirestore();
    firestore = stores.firestore;
    firestoreAuth = stores.firestoreAuth;

    query = firestore.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);
    queryAuthed = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id).withConverter(Converters.itemConverter);
    updateQueryAuthed = firestoreAuth.collection(COLLECTIONS.items).doc(mockItem.id);

    await setupFirestore(true, false);
}

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
