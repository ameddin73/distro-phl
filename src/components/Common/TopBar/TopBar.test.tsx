/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import {customRender, setupFirebase} from "test/utils";
import TopBar from "./TopBar";
import {PATHS} from "../../../util/config";

beforeAll(setupFirebase);
afterAll(teardownFirebase);

it('should mount', () => {
    customRender(<TopBar/>);
});

it('renders title', async () => {
    customRender(<TopBar/>);
    screen.getByText('Distro PHL');
});

it('navigates to home when title clicked', async () => {
    customRender(<TopBar/>);
    fireEvent.click(screen.getByText('Distro PHL'));
    expect(window.location.pathname).toBe(PATHS.public.base);
});
