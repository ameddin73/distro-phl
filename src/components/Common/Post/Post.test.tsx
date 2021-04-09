/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase} from "test/utils";
import Post from "./Post";
import {PostMocks} from "test/mocks/post.mock";

const mockDefaultPost = PostMocks.defaultPost;
const testPostActionText = 'test post action text';

const TestPostAction = () => (
    <div>{testPostActionText}</div>
)
beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<Post id={mockDefaultPost.id}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());

it('should mount', async () => {
});

it('renders post details properly', async () => {
    screen.getByText(mockDefaultPost.name);
    screen.getByText(mockDefaultPost.description);
    screen.getByText(mockDefaultPost.userName);
});

it('renders post action properly', async () => {
    customRender(<Post id={mockDefaultPost.id} postAction={TestPostAction}/>);
    await waitFor(() => screen.getByText(testPostActionText));
});