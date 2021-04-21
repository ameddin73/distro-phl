/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, setupFirebase, teardownFirebase} from "test/utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {PostInterface} from "util/types";
import {PostMocks} from "test/mocks/post.mock";
import "firebase/firestore";
import DistroAction from "./DistroAction";
import {PATHS} from "util/config";

let post: PostInterface;

beforeAll(async () => {
    await setupFirebase();
    post = new PostInterface(PostMocks.defaultPost);
});
beforeEach(load)
afterAll(teardownFirebase);

it('should mount', () => {
});

it('should redirect to login when click offer unauthed', async () => {
    fireEvent.click(screen.getByLabelText('offer-button'));
    expect(window.location.pathname).toBe(PATHS.public.login);
});

// TODO show my offer create offer delete offer don't show any offer if userFour

async function load() {
    customRender(<DistroAction post={post}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
}

