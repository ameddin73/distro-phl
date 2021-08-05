/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import {resetFirebase, setupFirebase, teardownFirebase, waitForSuspendedRender} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import PostCard from "./PostCard";
import {PATHS} from "util/config";
import {Post} from "util/types.distro";

const mockDefaultPost = PostMocks.defaultPost as Post;

beforeAll(setupFirebase);
beforeEach(async () => {
    await load();
}, 60000);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', () => {
    expect(true).toBeTruthy();
});

it('renders post details properly', () => {
    screen.getByText(mockDefaultPost.name);
    screen.getByText(mockDefaultPost.userName);
});

it('navigates to post', () => {
    fireEvent.click(screen.getByTestId('card-action'));
    expect(window.location.pathname).toBe(`${PATHS.public.posts}/${mockDefaultPost.id}`);
});

async function load(post: Post = mockDefaultPost) {
    await waitForSuspendedRender(<PostCard post={post}/>);
}