/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import {customRender, setupFirebase} from "test/utils";
import NothingHere from "./NothingHere";
import {PATHS} from "../../../util/config";

beforeAll(setupFirebase);

it('should mount', () => {
    customRender(<NothingHere/>);
});

it('renders properly', () => {
    customRender(<NothingHere/>);
    screen.getByText('Oops, theres nothing here.');
    screen.getByText('Make a Post');
});

it('navigates when button clicked', async () => {
    customRender(<NothingHere/>);
    fireEvent.click(screen.getByText('Make a Post'));
    expect(window.location.pathname).toBe(PATHS.public.createItem);
});