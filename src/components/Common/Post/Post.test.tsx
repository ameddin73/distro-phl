/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import Post from "./Post";
import {PostMocks} from "test/mocks/post.mock";
import {PostInterface} from "./types";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;
const testPostActionText = 'test post action text';

const TestPostAction = () => (
    <div>{testPostActionText}</div>
)
beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<Post post={mockDefaultPost}/>);
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

it('renders post action properly', async () => {
    customRender(<Post post={mockDefaultPost} postAction={TestPostAction}/>);
    await waitFor(() => screen.getByText(testPostActionText));
});