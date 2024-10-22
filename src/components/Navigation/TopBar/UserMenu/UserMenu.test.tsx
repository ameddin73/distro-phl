import React from 'react';
import UserMenu from './UserMenu';
import {setupFirebase, signIn, teardownFirebase, waitForSuspendedRender} from "test/utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {UserMocks} from "test/mocks/user.mock";
import {PATHS} from "util/config";
import firebase from "firebase/app";

beforeAll(setupFirebase);
beforeEach(async () => waitForSuspendedRender(<UserMenu/>));
afterAll(teardownFirebase);

it('should mount', async () => {
    screen.getByText('Sign In');
});

it('navigates to sign in when clicked if not signed in', async () => {
    fireEvent.click(screen.getByText('Sign In'));
    expect(window.location.pathname).toBe(PATHS.public.login);
});

describe('when user logged in', () => {
    beforeAll(async () => await signIn(UserMocks.defaultUser));
    beforeEach(() => fireEvent.click(screen.getByLabelText('menu')));

    it('render drawer when clicked if signed in', async () => {
        screen.getByText('New Post');
        screen.getByText('My Posts');
        screen.getByText('Sign Out');
    });

    it('navigates to new post', async () => {
        fireEvent.click(screen.getByText('New Post'));
        expect(window.location.pathname).toBe(PATHS.public.newPost);
    });

    it('navigates to my posts', async () => {
        fireEvent.click(screen.getByText('My Posts'));
        expect(window.location.pathname).toBe(PATHS.public.userPosts);
    });

    it('signs out', async () => {
        fireEvent.click(screen.getByText('Sign Out'));
        await waitFor(() => expect(firebase.auth().currentUser).toBeFalsy());
    });
})