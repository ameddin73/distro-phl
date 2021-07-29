/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {destroyFirebase, initFirebase, setupFirestore, startFirestore, teardownFirestore} from "./utils";
import firebase from "firebase";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";
import {firestore as testFirestore} from "firebase-admin";
import {Mutable} from "../types";
import {assertFails, assertSucceeds, initializeTestApp} from "@firebase/rules-unit-testing";
import _ from "lodash";
import {UserMocks} from "../mocks/user.mock";
import {PostMocks} from "../mocks/post.mock";
import {Post, PostInterface} from "util/types.distro";
import {firestore} from "firebase-admin/lib/firestore";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;

let firestoreInstance: firebase.firestore.Firestore;
let firestoreAuth: firebase.firestore.Firestore;
let firestoreAuth2: firebase.firestore.Firestore;
let firestoreAuthNameless: firebase.firestore.Firestore;
let firestoreAdmin: firestore.Firestore;

const mockPost = PostMocks.defaultPost;
const mockPost2 = PostMocks.secondaryPost;
const mockPostNameless = PostMocks.namelessPost;
const mocDoc = pruneDoc(mockPost);
const mocDoc2 = pruneDoc(mockPost2);
const mocDocNameless = pruneDoc(mockPostNameless);

let query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed2: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthedNameless: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let updateQueryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

beforeAll(initFirebase);
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => {
        const stores = await startFirestore();
        firestoreInstance = stores.firestore;
        firestoreAdmin = stores.firestoreAdmin;
        await setupFirestore(true);
    })
    afterAll(teardownFirestore);

    it('tests populates posts', async () => {
        const testPost: Mutable<PostInterface> = _.clone(PostMocks.defaultPost);
        const testPost2: Mutable<PostInterface> = _.clone(PostMocks.secondaryPost);
        delete testPost.created;
        delete testPost2.created;
        if (testPost.hasExpiration) {
            delete testPost.expires;
        }

        // @ts-ignore
        const query = firestoreAdmin.collection(COLLECTIONS.posts).where('active', '==', true).withConverter(Converters.PostConverter);
        const {docs: posts} = await query.get();
        expect(posts.length).toBe(6);
        for (let i = 0; i < 5; i++) {
            testPost.id = 'preset-post-' + i;
            expect(posts[i].data()).toMatchObject(testPost)
        }
        expect(posts[5].data()).toMatchObject(testPost2);
    });
});

describe('create post rules', () => {
    beforeAll(async () => {
        await buildFirestore();
    });
    beforeEach(async () => await setupFirestore(false));
    afterEach(async () => {
        await teardownFirestore();
    });

    it('tests creating default post', async () => {
        await assertSucceeds(queryAuthed.set(mocDoc));
    });

    it('tests creating secondary post', async () => {
        await assertSucceeds(queryAuthed2.set(mocDoc2));
    });

    it('tests creating nameless post', async () => {
        await assertFails(queryAuthedNameless.set(mocDocNameless));
    });

    it('tests types are valid', async () => {
        let testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        // @ts-ignore
        testDoc.active = 'string';
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.created = 'string';
        await assertFails(firestoreAuth.collection(COLLECTIONS.posts).doc('test').set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.description = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.name = true;
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.hasExpiration = 'string';
        await assertFails(queryAuthed.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.expires = 'string';
        await assertFails(firestoreAuth.collection(COLLECTIONS.posts).doc('test').set(testDoc));
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
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        delete testDoc.description;
        const testQuery = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id);
        await assertFails(testQuery.set(testDoc));
    });

    it('tests hasOnly rule', async () => {
        const testDoc: Mutable<PostInterface & { test: string }> = _.clone(mocDoc);
        testDoc.test = 'test';
        const testQueryFail = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id);
        await assertFails(testQueryFail.set(testDoc));
    });

    it('tests uidEqual rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        testDoc.uid = 'test uid';
        await assertFails(query.set(testDoc));
        await assertFails(queryAuthed.set(testDoc));
        testDoc.uid = PostMocks.defaultPost.uid;
        await assertSucceeds(queryAuthed.set(testDoc));
    });

    it('tests nameEqual rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        testDoc.userName = 'test name';

        await assertFails(queryAuthed.set(testDoc));
    });

    it('tests activeTrue rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        testDoc.active = false;

        const testQuery = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id);

        await assertFails(testQuery.set(testDoc));
    });

    it('tests createdNow rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')

        const testQuery = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id);

        await assertFails(testQuery.set(testDoc));

        // @ts-ignore
        testDoc.created = firebase.firestore.FieldValue.serverTimestamp();
        await assertSucceeds(testQuery.set(testDoc));
    });

    it('tests hasExpiration true rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        await assertSucceeds(queryAuthed.set(testDoc));
        // @ts-ignore
        delete testDoc.expires;
        await assertFails(firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id).set(testDoc));
    });

    it('tests hasExpiration false rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc2);
        await assertSucceeds(queryAuthed2.set(testDoc));
        testDoc.hasExpiration = true;
        await assertFails(firestoreAuth2.collection(COLLECTIONS.posts).doc(mockPost2.id).set(testDoc));
    });

    it('tests expiresLater rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);
        if (testDoc.hasExpiration) {
            testDoc.expires = new Date('26 Mar 2001 00:00:00 GMT')
        }

        await assertFails(query.set(testDoc));
    });

    it('tests typeExists rule', async () => {
        const testDoc: Mutable<PostInterface> = _.clone(mocDoc);

        await assertFails(query.set(testDoc));
    });
});

describe('update post rules', () => {
    beforeAll(async () => {
        await buildFirestore();
    });
    beforeEach(async () => {
        await setupFirestore(false);
        await queryAuthed.set(mocDoc);
        await queryAuthed2.set(mocDoc2);
    });
    afterEach(async () => {
        await teardownFirestore();
    });

    it('tests a valid update', async () => {
        await assertSucceeds(updateQueryAuthed.update({active: false}));
        await assertSucceeds(updateQueryAuthed.update({description: 'new description'}));
        await assertSucceeds(updateQueryAuthed.update({name: 'new name'}));
        await assertSucceeds(updateQueryAuthed.update({expires: new Date('02 Jan 2071 00:00:00 GMT')}));
        await assertSucceeds(updateQueryAuthed.update({image: 'images/posts/65c8e52e-c6ab-46ab-8615-9824c31864c1.a.b.c.png'}));
        await assertSucceeds(updateQueryAuthed.update({
            description: 'test',
            name: 'test',
            expires: new Date('02 Jan 2071 00:00:00 GMT'), image: 'images/posts/65c8e52e-c6ab-46ab-8615-9824c31864c1.a.b.c.png',
        }));

        const newName: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.defaultUser.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
        const nameQuery = newName.collection(COLLECTIONS.posts).doc(mockPost.id);
        await assertSucceeds(nameQuery.update({userName: UserMocks.userTwo.name}));
    });

    it('tests types are valid', async () => {
        await assertFails(updateQueryAuthed.update({active: 'string'}));
        await assertFails(updateQueryAuthed.update({description: true}));
        await assertFails(updateQueryAuthed.update({name: true}));
        await assertFails(updateQueryAuthed.update({expires: true}));
        await assertFails(updateQueryAuthed.update({image: true}));
        await assertFails(updateQueryAuthed.update({image: 'ill-formatted string'}));
        await assertFails(updateQueryAuthed.update({type: true}));
        await assertFails(updateQueryAuthed.update({userName: true}));
    });

    it('tests hasOnly rule', async () => {
        await assertFails(updateQueryAuthed.update({created: new Date()}));
        await assertFails(updateQueryAuthed.update({test: 'test'}));
        await assertFails(firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id).update({hasExpiration: false}));
    });

    it('tests uidEqual rule', async () => {
        const newName: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.userTwo.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
        const nameQuery = newName.collection(COLLECTIONS.posts).doc(mockPost.id);
        await assertFails(nameQuery.update({description: 'test'}));
    });

    it('tests activeOnly rule', async () => {
        await assertFails(updateQueryAuthed.update({active: false, description: 'test'}));
    });

    it('tests updateInactive rule', async () => {
        await assertFails(updateQueryAuthed.update({description: 'new description'}));
        await firestoreAdmin.collection(COLLECTIONS.posts).doc(mockPost.id).update({active: false})
        await assertSucceeds(updateQueryAuthed.update({description: 'new description'}));
    });

    it('tests update expires only if hasExpires', async () => {
        const testQuery = firestoreAuth2.collection(COLLECTIONS.posts).doc(mockPost2.id);
        await assertFails(testQuery.update({expires: new Date('01 Jan 2070 00:00:00 GMT')}));
    });

    it('tests update expires after today', async () => {
        await firestoreAdmin.collection(COLLECTIONS.posts).doc(mockPost.id).update({active: false})
        await assertSucceeds(updateQueryAuthed.update({expires: new Date('01 Jan 2070 00:00:00 GMT')}));
        await assertFails(updateQueryAuthed.update({expires: new Date('01 Jan 2000 00:00:00 GMT')}));
    });

});

describe('read post rules', () => {
    beforeAll(async () => {
        await buildFirestore();
        await setupFirestore(true);
        await queryAuthed.set(mocDoc);
        await queryAuthed.update({active: false});
    });
    afterAll(async () => {
        await teardownFirestore();
    });

    it('tests reading a single document', async () => {
        await assertSucceeds(queryAuthed.get());
    });

    it('tests reading a collection', async () => {
        await assertFails(firestoreInstance.collection(COLLECTIONS.posts).get());
        await assertSucceeds(firestoreInstance.collection(COLLECTIONS.posts).where('active', '==', true).where('hasExpiration', '==', false).get());
        await assertSucceeds(firestoreInstance.collection(COLLECTIONS.posts).where('active', '==', true).where('hasExpiration', '==', true).where('expires', '>', firebase.firestore.Timestamp.now()).get());
    });

    it('tests seeActive rule for active', async () => {
        let query = firestoreInstance.collection(COLLECTIONS.posts).where('active', '==', true).where('hasExpiration', '==', false);
        await assertSucceeds(query.get());

        query = firestoreInstance.collection(COLLECTIONS.posts).where('active', '==', false).where('hasExpiration', '==', false);
        await assertFails(query.get());
    });

    it('tests seeActive rule for authed', async () => {
        const query = firestoreAuth.collection(COLLECTIONS.posts).where('uid', '==', UserMocks.defaultUser.uid);
        await assertSucceeds(query.get());
        const collection = await query.get();
        expect(collection.docs.length).toBe(6);
    })

    it('tests seeUnexpired rule for authed', async () => {
        await firestoreAdmin.collection(COLLECTIONS.posts).doc(mockPost.id).update({expires: testFirestore.Timestamp.fromDate(new Date('26 Mar 2001 00:00:00 GMT'))});
        const query = firestoreAuth.collection(COLLECTIONS.posts).where('uid', '==', UserMocks.defaultUser.uid);
        await assertSucceeds(query.get());
        const collection = await query.get();
        expect(collection.docs.length).toBe(6);
    })
});

describe('delete post rules', () => {
    beforeAll(async () => {
        await buildFirestore();
    });
    beforeEach(async () => {
        await setupFirestore(false);
        await queryAuthed.set(mocDoc);
        await queryAuthed2.set(mocDoc2);
    });
    afterEach(async () => {
        await teardownFirestore();
    });

    it('tests a valid delete', async () => {
        await assertSucceeds(updateQueryAuthed.delete());
    });

    it('tests uidEqual rule', async () => {
        const newName: firebase.firestore.Firestore = initializeTestApp({projectId: PROJECT_ID, auth: {uid: UserMocks.userTwo.uid, name: UserMocks.userTwo.name, email: UserMocks.userTwo.email}}).firestore();
        const nameQuery = newName.collection(COLLECTIONS.posts).doc(mockPost.id);
        await assertFails(nameQuery.delete());
    });
});

async function buildFirestore() {
    const stores = await startFirestore();
    firestoreInstance = stores.firestore;
    firestoreAuth = stores.firestoreAuth;
    firestoreAuth2 = stores.firestoreAuth2;
    firestoreAuthNameless = stores.firestoreNameless;
    firestoreAdmin = stores.firestoreAdmin;

    query = firestoreInstance.collection(COLLECTIONS.posts).doc(mockPost.id).withConverter(Converters.PostConverter);
    queryAuthed = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id).withConverter(Converters.PostConverter);
    queryAuthed2 = firestoreAuth2.collection(COLLECTIONS.posts).doc(mockPost2.id).withConverter(Converters.PostConverter);
    queryAuthedNameless = firestoreAuthNameless.collection(COLLECTIONS.posts).doc(mockPostNameless.id).withConverter(Converters.PostConverter);
    updateQueryAuthed = firestoreAuth.collection(COLLECTIONS.posts).doc(mockPost.id);

    await setupFirestore(false);
}

function pruneDoc(post: Post) {
    const tmpDoc: Mutable<Post> = _.clone(post);
    delete tmpDoc.id;
    delete tmpDoc.created;
    return tmpDoc;
}
