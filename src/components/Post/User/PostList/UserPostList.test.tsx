/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {setupFirebase, signIn, teardownFirebase, waitForSuspendedRender} from "test/utils";
import {screen} from "@testing-library/react";
import {UserMocks} from "test/mocks/user.mock";
import UserPostList from './UserPostList';

beforeAll(async () => {
    await setupFirebase()
    await signIn(UserMocks.userTwo);
});
beforeEach(async () => waitForSuspendedRender(<UserPostList/>)); // This is slow because the emulator has to create a new index
afterAll(teardownFirebase);

it('should mount', () => {
});

it('renders all posts', async () => {
    const posts = screen.getAllByText('Posted by');
    expect(posts.length).toBe(1);
});