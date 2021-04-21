/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, resetFirebase, setupFirebase, signIn, teardownFirebase} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import DistroHub from "./DistroHub";
import {UserMocks} from "../../test/mocks/user.mock";

beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<DistroHub/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', async () => {
});

it('renders all posts', async () => {
    const items = screen.getAllByText('Posted by');
    expect(items.length).toBeGreaterThanOrEqual(5);
});

it('filters posts when logged in', async () => {
    screen.getAllByText(UserMocks.userThree.name);
    await signIn(UserMocks.userThree);
    expect(screen.queryAllByText(UserMocks.userThree.name)).toHaveLength(0);
});