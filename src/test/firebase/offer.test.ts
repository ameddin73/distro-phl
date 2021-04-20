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

let firestore: firebase.firestore.Firestore;
let firestoreAuth2: firebase.firestore.Firestore;
let firestoreAuth3: firebase.firestore.Firestore;
let firestoreAdmin: firebase.firestore.Firestore;

const mockOffer = OfferMocks.defaultOffer;
const mockOffer2 = OfferMocks.secondaryOffer;
const mocDoc: Mutable<Offer> = _.clone(mockOffer);
delete mocDoc.id;
delete mocDoc.created;
const mocDoc2: Mutable<Offer> = _.clone(mockOffer2);
delete mocDoc2.id;
delete mocDoc2.created;

let query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed2: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
let queryAuthed3: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

beforeAll(async () => {
    await initFirebase();
    const stores = startFirestore();
    firestore = stores.firestore;
    firestoreAuth2 = stores.firestoreAuth2;
    firestoreAuth3 = stores.firestoreAuth3;
    firestoreAdmin = stores.firestoreAdmin;
});
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => {
        const stores = await startFirestore();
        firestoreAdmin = stores.firestoreAdmin;
        await setupFirestore(false, true);
    });
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
});

async function setDefaultPost() {
    const post: Mutable<Post> = _.clone(PostMocks.defaultPost);
    delete post.id;
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id).set(post);
}

function buildQueries() {
    queryAuthed2 = buildQuery(firestoreAuth2).doc(mockOffer.id);
    queryAuthed3 = buildQuery(firestoreAuth3).doc(mockOffer2.id);
}

function buildQuery(firestoreInstance: firebase.firestore.Firestore, noConverter?: boolean) {
    const query = firestoreInstance.collection(COLLECTIONS.posts).doc(PostMocks.defaultPost.id).collection(COLLECTIONS.offers);
    if (noConverter) return query;
    return query.withConverter(Converters.OfferConverter);
}