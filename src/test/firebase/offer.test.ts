/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {destroyFirebase, initFirebase, setupFirestore, startFirestore, teardownFirestore} from "./utils";
import firebase from "firebase";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../mocks/post.mock";
import {OfferMocks} from "../mocks/offer.mock";
import {Converters} from "util/utils";
import {Mutable} from "../types";
import _ from "lodash";
import {Offer, Post} from "util/types";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {UserMocks} from "../mocks/user.mock";
import {firestore} from "firebase-admin/lib/firestore";

let firestoreInstance: firebase.firestore.Firestore;
let firestoreAuth: firebase.firestore.Firestore;
let firestoreAuth2: firebase.firestore.Firestore;
let firestoreAuth3: firebase.firestore.Firestore;
let firestoreAdmin: firestore.Firestore;

const mockOffer = OfferMocks.defaultOffer;
const mockOffer2 = OfferMocks.secondaryOffer;
const mocDoc: Mutable<Offer> = _.clone(mockOffer);
delete mocDoc.id;
delete mocDoc.created;
const mocDoc2: Mutable<Offer> = _.clone(mockOffer2);
delete mocDoc2.id;
delete mocDoc2.created;

let query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed2: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed3: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

beforeAll(async () => {
    await initFirebase();
    const stores = startFirestore();
    firestoreInstance = stores.firestore;
    firestoreAuth = stores.firestoreAuth;
    firestoreAuth2 = stores.firestoreAuth2;
    firestoreAuth3 = stores.firestoreAuth3;
    firestoreAdmin = stores.firestoreAdmin;
});
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => await setupFirestore(false, true));
    afterAll(teardownFirestore);

    it('tests populates offers', async () => {
        const query = firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id).collection(COLLECTIONS.offers).withConverter(Converters.OfferConverter);
        const {docs: offers} = await query.get();
        expect(offers.length).toBe(2);
        expect(offers[0].data()).toMatchObject(OfferMocks.defaultOffer)
        expect(offers[1].data()).toMatchObject(OfferMocks.secondaryOffer)
    });
});

describe('create offer rules', () => {
    beforeAll(buildQueries);
    beforeEach(setDefaultPost)
    afterEach(teardownFirestore);

    it('tests creating default offer', async () => {
        await assertSucceeds(queryAuthed2.set(mocDoc));
    });

    it('tests creating secondary offer', async () => {
        await assertSucceeds(queryAuthed2.set(mocDoc));
        await assertSucceeds(queryAuthed3.set(mocDoc2));
    });

    it('tests types are valid', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        // @ts-ignore
        testDoc.created = 'string';
        await assertFails(buildQuery(firestoreAuth2, true).doc(mockOffer.id).set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.message = false;
        await assertFails(queryAuthed2.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.userName = false;
        await assertFails(queryAuthed2.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.postId = false;
        await assertFails(queryAuthed2.set(testDoc));
        testDoc = _.clone(mocDoc);
        // @ts-ignore
        testDoc.posterId = false;
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests hasAll rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        delete testDoc.message;
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests hasOnly rule', async () => {
        let testDoc: Mutable<Offer & { test: string }> = _.clone(mocDoc);
        testDoc.test = 'test'
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests userName equal rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        testDoc.userName = 'test';
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests uid equal rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        const testQuery = buildQuery(firestoreAuth2).doc(UserMocks.defaultUser.uid);
        await assertFails(testQuery.set(testDoc));
    });

    it('tests postId Equal rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        testDoc.postId = 'test';
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests not poster id rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        const testQuery = buildQuery(firestoreAuth).doc(PostMocks.defaultPost.uid);
        await assertFails(testQuery.set(testDoc));
    });

    it('tests posterId Equal rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        testDoc.posterId = 'test';
        await assertFails(queryAuthed2.set(testDoc));
    });

    it('tests createdNow rule', async () => {
        let testDoc: Mutable<Offer> = _.clone(mocDoc);
        testDoc.created = new Date('26 Mar 2021 00:00:00 GMT')
        const testQuery = buildQuery(firestoreAuth2, true).doc(mockOffer.id);
        await assertFails(testQuery.set(testDoc));
        // @ts-ignore
        testDoc.created = firebase.firestore.FieldValue.serverTimestamp();
        await assertSucceeds(testQuery.set(testDoc));
    });
});

describe('read offer rules', () => {
    beforeAll(async () => {
        await setupFirestore(false, true);
        buildQueries();
    });
    afterAll(teardownFirestore);

    it('tests offerer reading', async () => {
        await assertSucceeds(queryAuthed2.get());
    });

    it('tests poster reading', async () => {
        await assertSucceeds(queryAuthed.get());
    });

    it('tests poster list', async () => {
        const testQuery = buildQuery(firestoreAuth);
        await assertSucceeds(testQuery.where('posterId', '==', UserMocks.defaultUser.uid).get());
    });

    it('tests unAuthed reading', async () => {
        await assertFails(query.get());
    });

    it('tests third user reading', async () => {
        const testQuery = buildQuery(firestoreAuth3).doc(mockOffer.id);
        await assertFails(testQuery.get());
    });
});

describe('update offer rules', () => {
    beforeAll(async () => {
        await setupFirestore(false, true);
        buildQueries();
    });
    afterAll(teardownFirestore);

    it('tests offerer update', async () => {
        await assertFails(queryAuthed2.update({message: 'test'}));
    });

    it('tests poster update', async () => {
        await assertFails(queryAuthed.update({message: 'test'}));
    });

    it('tests unAuthed update', async () => {
        await assertFails(query.update({message: 'test'}));
    });

    it('tests third user update', async () => {
        const testQuery = buildQuery(firestoreAuth3).doc(mockOffer.id);
        await assertFails(testQuery.update({message: 'test'}));
    });
});

describe('delete offer rules', () => {
    beforeAll(buildQueries);
    beforeEach(async () => await setupFirestore(false, true))
    afterEach(teardownFirestore);

    it('tests offerer delete', async () => {
        await assertSucceeds(queryAuthed2.delete());
    });

    it('tests poster delete', async () => {
        await assertSucceeds(queryAuthed.delete());
    });

    it('tests unAuthed delete', async () => {
        await assertFails(query.delete());
    });

    it('tests third user delete', async () => {
        const testQuery = buildQuery(firestoreAuth3).doc(mockOffer.id);
        await assertFails(testQuery.delete());
    });
});

async function setDefaultPost() {
    const post: Mutable<Post> = _.clone(PostMocks.defaultPost);
    delete post.id;
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id).set(post);
}

function buildQueries() {
    query = buildQuery(firestoreInstance).doc(mockOffer.id);
    queryAuthed = buildQuery(firestoreAuth).doc(mockOffer.id);
    queryAuthed2 = buildQuery(firestoreAuth2).doc(mockOffer.id);
    queryAuthed3 = buildQuery(firestoreAuth3).doc(mockOffer2.id);
}

function buildQuery(firestoreInstance: firebase.firestore.Firestore, noConverter?: boolean) {
    const query = firestoreInstance.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id).collection(COLLECTIONS.offers);
    if (noConverter) return query;
    return query.withConverter(Converters.OfferConverter);
}