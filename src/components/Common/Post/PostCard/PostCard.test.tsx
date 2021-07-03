/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import PostCard from "./PostCard";
import {PATHS} from "util/config";
import {PostInterface} from "util/types";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;

beforeAll(setupFirebase);
beforeEach(async () => {
    await load();
}, 60000);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', async () => {
});

it('renders post details properly', () => {
    screen.getByText(mockDefaultPost.name);
    screen.getByText(mockDefaultPost.userName);
});

it('navigates to post', () => {
    fireEvent.click(screen.getByTestId('card-action'));
    expect(window.location.pathname).toBe(`${PATHS.public.posts}/${mockDefaultPost.id}`);
});

async function load(post: PostInterface = mockDefaultPost) {
    customRender(<PostCard post={post}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}