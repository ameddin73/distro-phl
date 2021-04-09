/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import UserAction from './UserAction';
import {customRender, getFirebase, resetFirebase, setupFirebase, signIn} from "test/utils";
import {COLLECTIONS, DEFAULT_IMAGE} from "util/config";
import {Converters} from "util/utils";
import {UserMocks} from "test/mocks/user.mock";
import {TypesMocks} from "test/mocks/type.mock";
import {fireEvent, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import {v4} from 'uuid';

let doc: any;

beforeAll(async () => {
    await setupFirebase()
    await signIn();
});
beforeEach(async () => {
    doc = getFirebase().firestore().collection(COLLECTIONS.posts).doc(v4()).withConverter(Converters.PostConverter);
    await doc.set({
        active: true,
        description: "",
        displayName: "",
        hasExpiration: false,
        image: DEFAULT_IMAGE,
        type: Object.keys(TypesMocks.defaultTypes)[0],
        uid: UserMocks.defaultUser.uid,
        userName: UserMocks.defaultUser.name,
    });
    const documentSnapshot = await doc.get();
    // @ts-ignore
    const item = documentSnapshot.data();

    customRender(<UserAction {...item}/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 5000})
});
afterAll(async () => {
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

it('should set item inactive', (done) => {
    doDelete();

    doc.onSnapshot((doc: any) => {
        // @ts-ignore
        const item = doc.data();
        if (!item.active) done();
    });
});

it('should open success snackbar', async () => {
    doDelete();
    await waitFor(() => screen.getByText('Deleted Successfully.'));
})

it('should open fail snackbar', async () => {
    getFirebase().firestore().collection = jest.fn().mockReturnValue({
        doc: () => ({
            withConverter: () => ({
                update: jest.fn().mockImplementation(() => {
                    return new Promise(() => {
                        throw new Error('Mock error')
                    });
                }),
            }),
        }),
    });
    doDelete();
    await waitFor(() => screen.getByText('Post failed to delete.'));
})

function doDelete(incomplete?: boolean) {
    fireEvent.click(screen.getByLabelText('delete'));
    screen.getByText("This can't be undone.");
    fireEvent.click(screen.getByText(incomplete ? 'Cancel' : 'Delete'));
}