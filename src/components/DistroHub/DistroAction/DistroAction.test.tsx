/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, setupFirebase, signIn, signOut, teardownFirebase} from "test/utils";
import {cleanup, fireEvent, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import {PostInterface} from "util/types";
import {PostMocks} from "test/mocks/post.mock";
import "firebase/firestore";
import DistroAction from "./DistroAction";
import {PATHS} from "util/config";
import {UserMocks} from "../../../test/mocks/user.mock";

let post: PostInterface, post2: PostInterface;

beforeAll(async () => {
    await setupFirebase();
    post = new PostInterface(PostMocks.defaultPost);
});
beforeEach(async () => await load());
afterAll(teardownFirebase);

it('should mount', () => {
});

it('should redirect to login when click offer unauthed', async () => {
    fireEvent.click(screen.getByLabelText('offer-button'));
    expect(window.location.pathname).toBe(PATHS.public.login);
});

it("should show logged in user's offer", async () => {
    await signIn(UserMocks.userThree);
    await waitFor(() => screen.getByText('Offer by'));
});

describe('delete offer', () => {
    beforeEach(async () => {
        await signIn(UserMocks.userThree);
        await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
        fireEvent.click(screen.getByLabelText('delete-button'));
    });

    it('should open delete dialog', async () => {
        screen.getByText('Are you sure you want to delete this response?');
    });

    it('should close delete dialog', async () => {
        fireEvent.click(screen.getByText('Cancel'));
        await waitForElementToBeRemoved(screen.getByText('Are you sure you want to delete this response?'));
    });

    it('should delete offer', async () => {
        fireEvent.click(screen.getByText('Delete'));
        await waitFor(() => screen.getByText(`Respond to ${PostMocks.defaultPost.userName}`));
    });
})

describe('create offer', () => {
    const dialog = `Let ${PostMocks.defaultPost.userName} know you're interested`;
    beforeAll(async () => await signIn(UserMocks.userFour));
    beforeEach(async () => {
        await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
        fireEvent.click(screen.getByLabelText('offer-button'));
    });
    afterAll(signOut);

    it('should open create dialog', async () => {
        screen.getByText(dialog);
    });

    it('should close create dialog', async () => {
        fireEvent.click(screen.getByText('Cancel'));
        await waitForElementToBeRemoved(screen.getByText(dialog));
    });

    it('should not create offer if message too short', async () => {
        fireEvent.click(screen.getByText('Submit'));
        screen.getByText(dialog);
    });

    it('should create offer', async () => {
        fireEvent.change(screen.getByLabelText('message'), {target: {value: 'This is a test string'}});
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => screen.getByText('Offer by'));
    });
})

describe('snackbars', () => {
    beforeAll(async () => await signIn(UserMocks.defaultUser));
    beforeEach(async () => {
        // @ts-ignore
        post2 = new PostInterface(PostMocks.secondaryPost);
        cleanup();
        await load(post2);
        await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
        fireEvent.click(screen.getByLabelText('offer-button'));
    });
    afterAll(signOut);

    it('should open fail snackbar', async () => {
        post2.offersRef.doc = jest.fn().mockReturnValue({
            set: jest.fn().mockImplementation(() => {
                return new Promise(() => {
                    throw new Error('Mock Error')
                })
            }),
        });
        fireEvent.change(screen.getByLabelText('message'), {target: {value: 'This is a test string'}});
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => screen.getByText('Response failed to send.'));
    });

    it('should open success snackbar', async () => {
        fireEvent.change(screen.getByLabelText('message'), {target: {value: 'This is a test string'}});
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => screen.getByText('Response sent.'));
    });
})

async function load(postProp: PostInterface = post) {
    customRender(<DistroAction post={postProp}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
}

