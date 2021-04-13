/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, resetFirebase, setupFirebase, signIn} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import DistroHub from "./DistroHub";

beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<DistroHub/>)
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());
afterAll(async () => await resetFirebase(true));

it('should mount', async () => {
});

it('renders all items', async () => {
    const items = screen.getAllByText('Posted by');
    expect(items.length).toBeGreaterThanOrEqual(5);
});

describe('when signed in', () => {
    beforeAll(async () => await signIn());

    it('filters items', async () => {
        const items = screen.getAllByText('Posted by');
        expect(items.length).toBe(1);
    });
})