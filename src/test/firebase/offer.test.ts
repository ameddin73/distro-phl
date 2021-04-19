/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import {initFirebase, setupFirestore, startFirestore, teardownFirestore} from "./utils";
import firebase from "firebase";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../mocks/post.mock";
import {OfferMocks} from "../mocks/offer.mock";
import {Converters} from "../../util/utils";

let firestoreAdmin: firebase.firestore.Firestore;

beforeAll(initFirebase);

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