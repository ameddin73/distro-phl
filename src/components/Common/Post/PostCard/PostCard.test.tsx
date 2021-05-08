/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import PostCard from "./PostCard";
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
    customRender(<PostCard post={mockSecondaryPost}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
    screen.getByText(mockSecondaryPost.name);
    expect(screen.queryByText('Expires')).toBeNull();
    screen.getByText(mockSecondaryPost.userName);
});