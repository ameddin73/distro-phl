/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import UserItems from './UserItems';
import {customRender, resetFirebase, setupFirebase, signIn} from "test/utils";
import {screen, waitFor} from "@testing-library/react";

beforeAll(async () => {
    await setupFirebase()
    await signIn();
});
beforeEach(async () => {
    customRender(<UserItems/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 5000})
}, 5000); // TODO why is this slow?
afterAll(async () => await resetFirebase(true));

it('should mount', () => {
});

it('renders all items', async () => {
    const items = screen.getAllByText('Supplied by:');
    expect(items.length).toBe(5);
});

it('renders user action', async () => {
    const items = screen.getAllByLabelText('delete');
    expect(items.length).toBe(5);
});
