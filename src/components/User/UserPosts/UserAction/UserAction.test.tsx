/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import UserAction from './UserAction';
import {customRender, getFirebase, resetFirebase, setupFirebase, signIn} from "test/utils";
import {COLLECTIONS, PATHS} from "util/config";
import {Converters} from "util/utils";
import {UserMocks} from "test/mocks/user.mock";
import {fireEvent, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import {v4} from 'uuid';
import {PostInterface} from "../../../Common/Post/types";

let doc: any;
let post: PostInterface;
let unsubscribe = () => {
};

beforeAll(async () => {
    await setupFirebase()
    await signIn();
});
beforeEach(async () => {
    doc = getFirebase().firestore().collection(COLLECTIONS.posts).doc(v4()).withConverter(Converters.PostConverter);
    await doc.set({
        active: true,
        description: "",
        name: "",
        hasExpiration: false,
        uid: UserMocks.defaultUser.uid,
        userName: UserMocks.defaultUser.name,
    });
    const documentSnapshot = await doc.get();
    // @ts-ignore
    post = documentSnapshot.data();

    customRender(<UserAction post={post}/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 5000})
});
afterAll(async () => {
    unsubscribe();
    await resetFirebase(true)
});

it('should mount', () => {
});

it('should open modal when delete', () => {
    fireEvent.click(screen.getByLabelText('delete'));
    screen.getByText("This can't be undone.");
});

it('should close modal if canceled', async () => {
    doDelete(true);
    await waitForElementToBeRemoved(() => screen.getByText("This can't be undone."))
});

it('should set post inactive', (done) => {
    doDelete();

    unsubscribe = doc.onSnapshot((doc: any) => {
        // @ts-ignore
        const post = doc.data();
        if (!post.active) done();
    });
});

it('should open success snackbar', async () => {
    doDelete();
    await waitFor(() => screen.getByText('Deleted Successfully.'));
})

it('redirects to user posts', async () => {
    doDelete();
    expect(window.location.pathname).toBe(PATHS.public.userPosts);
})

it('should open fail snackbar', async () => {
    post.setActive = jest.fn().mockImplementation(() => {
        return new Promise(() => {
            throw new Error('Mock Error')
        })
    });
    doDelete();
    await waitFor(() => screen.getByText('Post failed to delete.'));
})

function doDelete(incomplete?: boolean) {
    fireEvent.click(screen.getByLabelText('delete'));
    screen.getByText("This can't be undone.");
    fireEvent.click(screen.getByText(incomplete ? 'Cancel' : 'Delete'));
}