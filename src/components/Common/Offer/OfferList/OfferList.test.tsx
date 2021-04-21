/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, getFirebase, setupFirebase, signIn, teardownFirebase} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import {PostInterface} from "util/types";
import {UserMocks} from "test/mocks/user.mock";
import OfferList from "./OfferList";
import {PostMocks} from "test/mocks/post.mock";
import firebase from "firebase/app";
import "firebase/firestore";
import {COLLECTIONS} from "../../../../util/config";
import {v4} from "uuid";
import {Converters} from "../../../../util/utils";

let offersRef: firebase.firestore.Query;

beforeAll(async () => {
    await setupFirebase();
    const post = new PostInterface(PostMocks.defaultPost);
    offersRef = appendWhere(post.offersRef, UserMocks.defaultUser.uid);
});
afterAll(teardownFirebase);

it('renders no offers message if query returns empty list', async () => {
    await signIn(UserMocks.userFour);
    const doc = getFirebase().firestore().collection(COLLECTIONS.posts).doc(v4()).withConverter(Converters.PostConverter);
    // @ts-ignore
    await doc.set({
        active: true,
        description: "",
        name: "",
        hasExpiration: false,
        uid: UserMocks.userFour.uid,
        userName: UserMocks.userFour.name,
    });
    const documentSnapshot = await doc.get();
    // @ts-ignore
    const {offersRef: offersRef1} = documentSnapshot.data();
    const tempRef = appendWhere(offersRef1, UserMocks.userFour.uid);

    await load(tempRef);
    screen.getByText('No offers yet.');
});

describe('renders correctly', () => {
    beforeAll(async () => signIn(UserMocks.defaultUser));
    beforeEach(async () => await load(offersRef));

    it('should mount', async () => {
    });

    it('renders all posts', async () => {
        const posts = screen.getAllByText('Offer by');
        expect(posts.length).toBeGreaterThanOrEqual(1);
    });
});

async function load(ref: firebase.firestore.Query) {
    customRender(<OfferList offersRef={ref}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
}

function appendWhere(query: firebase.firestore.Query, uid: string) {
    return query.where('posterId', '==', uid);
}