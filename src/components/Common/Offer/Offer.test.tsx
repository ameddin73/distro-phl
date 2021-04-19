/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import Offer from "./Offer";
import {PATHS} from "util/config";
import * as MockDate from "mockdate";
import {PostInterface} from "util/types";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;
const mockSecondaryPost = PostMocks.secondaryPost as PostInterface;

beforeAll(async () => {
    await setupFirebase();
    // @ts-ignore
    MockDate.set(mockDefaultPost.expires);
});
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('does not render expires if no expiration', async () => {
    customRender(<Offer post={mockSecondaryPost}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
    screen.getByText(mockSecondaryPost.name);
    expect(screen.queryByText('Expires')).toBeNull();
    screen.getByText(mockSecondaryPost.userName);
});

describe('post with expires', () => {
    beforeEach(async () => {
        customRender(<Offer post={mockDefaultPost}/>);
        await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
    }, 60000);

    it('should mount', async () => {
    });

    it('renders post details properly', () => {
        screen.getByText(mockDefaultPost.name);
        // @ts-ignore
        screen.getByText(mockDefaultPost.expires.toLocaleDateString('en-US', {month: 'long', day: 'numeric'}));
        screen.getByText(mockDefaultPost.userName);
    });

    it('navigates to post', () => {
        fireEvent.click(screen.getByTestId('card-action'));
        expect(window.location.pathname).toBe(`${PATHS.public.posts}/${mockDefaultPost.id}`);
    });
})