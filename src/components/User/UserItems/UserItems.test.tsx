/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import UserItems from './UserItems';
import {customRender, resetFirebase, setupFirebase, signIn} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import {UserMocks} from "../../../test/mocks/user.mock";

beforeAll(async () => {
    await setupFirebase()
    await signIn(UserMocks.userTwo);
});
beforeEach(async () => {
    customRender(<UserItems/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000); // This is slow because the emulator has to create a new index
afterAll(async () => await resetFirebase(true));

it('should mount', () => {
});

it('renders all items', async () => {
    const items = screen.getAllByText('Supplied by:');
    expect(items.length).toBe(1);
});

it('renders user action', async () => {
    const items = screen.getAllByLabelText('delete');
    expect(items.length).toBe(1);
});
