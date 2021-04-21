/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, setupFirebase, signIn, teardownFirebase} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import {PostInterface} from "util/types";
import {UserMocks} from "test/mocks/user.mock";
import OfferList from "./OfferList";
import {PostMocks} from "test/mocks/post.mock";
import firebase from "firebase/app";
import "firebase/firestore";

let offersRef: firebase.firestore.Query;

beforeAll(async () => {
    await setupFirebase();
    const post = new PostInterface(PostMocks.defaultPost);
    offersRef = appendWhere(post.offersRef, UserMocks.defaultUser.uid);
});
afterAll(teardownFirebase);

it('renders no offers message if query returns empty list', async () => {
    await signIn(UserMocks.userTwo);
    // @ts-ignore
    const post = new PostInterface(PostMocks.secondaryPost);
    const tempRef = appendWhere(post.offersRef, UserMocks.userTwo.uid);

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
        expect(posts.length).toBeGreaterThanOrEqual(2);
    });
});

async function load(ref: firebase.firestore.Query) {
    customRender(<OfferList offersRef={ref}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
}

function appendWhere(query: firebase.firestore.Query, uid: string) {
    return query.where('posterId', '==', uid);
}