/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import {customRender, rendersNothingHere, setupFirebase, teardownFirebase} from "test/utils";
import NothingHere from "./NothingHere";
import {PATHS} from "../../../util/config";

beforeAll(setupFirebase);
afterAll(teardownFirebase);

it('should mount', () => {
    customRender(<NothingHere/>);
});

it('renders properly', () => {
    customRender(<NothingHere/>);
    rendersNothingHere();
});

it('navigates when button clicked', async () => {
    customRender(<NothingHere/>);
    fireEvent.click(screen.getByText('Make a Post'));
    expect(window.location.pathname).toBe(PATHS.public.newPost);
});