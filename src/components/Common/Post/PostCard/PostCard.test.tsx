/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import {PostInterface} from "../types";
import PostCard from "./PostCard";
import {PATHS} from "util/config";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;

beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<PostCard post={mockDefaultPost}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', async () => {
});

it('renders post details properly', () => {
    screen.getByText(mockDefaultPost.name);
    screen.getByText(mockDefaultPost.description);
    screen.getByText(mockDefaultPost.userName);
});

it('navigates to post', () => {
    fireEvent.click(screen.getByTestId('card-action'));
    expect(window.location.pathname).toBe(`${PATHS.public.posts}/${mockDefaultPost.id}`);
});