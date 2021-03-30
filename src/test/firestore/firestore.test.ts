/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {setupFirestore, startFirestore, teardownFirestore} from "./utils";
import {COLLECTIONS} from "util/config";
import {buildTypesObject, Converters} from "util/utils";
import {TypesMocks} from "test/mocks/type.mock";
import {ItemInterface, ItemTypeInterface} from "util/types";
import {assertFails, assertSucceeds, initializeTestApp} from "@firebase/rules-unit-testing";
import {ItemMocks} from "../mocks/item.mock";
import {Mutable} from "../types";
import firebase from "firebase";
import _ from "lodash";
import {UserMocks} from "../mocks/user.mock";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;

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

        const query = firestore.collection(COLLECTIONS.items).where('active', '==', true).withConverter(Converters.itemConverter);

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
        await assertSucceeds(updateQueryAuthed.update({description: 'new description'}));
        await assertSucceeds(updateQueryAuthed.update({displayName: 'new name'}));
        await assertSucceeds(updateQueryAuthed.update({expires: new Date('02 Jan 2071 00:00:00 GMT')}));
        await assertSucceeds(updateQueryAuthed.update({image: 'images/items/65c8e52e-c6ab-46ab-8615-9824c31864c1.a.b.c.png'}));
        await assertSucceeds(updateQueryAuthed.update({type: Object.keys(TypesMocks.defaultTypes)[1]}));
        await assertSucceeds(updateQueryAuthed.update({
            description: 'test',
            displayName: 'test',
            expires: new Date('02 Jan 2071 00:00:00 GMT'), image: 'images/items/65c8e52e-c6ab-46ab-8615-9824c31864c1.a.b.c.png',
            type: Object.keys(TypesMocks.defaultTypes)[2]
        }));

        const newName: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.defaultUser.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
        const nameQuery = newName.collection(COLLECTIONS.items).doc(mockItem.id);
        await assertSucceeds(nameQuery.update({userName: UserMocks.userTwo.name}));
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
        await assertFails(updateQueryAuthed.update({test: 'test'}));
    });

    it('tests uidEqual rule', async () => {
        const newName: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.userTwo.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
        const nameQuery = newName.collection(COLLECTIONS.items).doc(mockItem.id);
        await assertFails(nameQuery.update({description: 'test'}));
    });

    it('tests activeOnly rule', async () => {
        await assertFails(updateQueryAuthed.update({active: false, description: 'test'}));
    });

});

describe('read item rules', () => {
    beforeAll(async () => {
        await buildFirestore();
        await setupFirestore(true, true);
        await queryAuthed.set(mocDoc);
        await queryAuthed.update({active: false});
    });
    afterEach(async () => {
        unsubscribe();
    });
    afterAll(async () => {
        await teardownFirestore();
    });

    it('tests reading a single document', async () => {
        await assertSucceeds(queryAuthed.get());
    });

    it('tests reading a collection', async () => {
        await assertFails(firestoreAuth.collection(COLLECTIONS.items).get());
        await assertSucceeds(firestoreAuth.collection(COLLECTIONS.items).where('active', '==', true).get());
    });

    it('tests seeActive rule for active', async () => {
        const query = firestore.collection(COLLECTIONS.items).where('active', '==', true);
        await assertSucceeds(query.get());
        const collection = await query.get();
        expect(collection.docs.length).toBe(5);
    });

    it('tests seeActive rule for authed', async () => {
        const query = firestoreAuth.collection(COLLECTIONS.items).where('uid', '==', UserMocks.defaultUser.uid);
        await assertSucceeds(query.get());
        const collection = await query.get();
        expect(collection.docs.length).toBe(6);
    })
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
