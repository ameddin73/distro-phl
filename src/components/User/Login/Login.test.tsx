/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import Login from './Login';
import {customRender, getFirebase, resetFirebase, setupFirebase, signIn} from "test/utils";
import {PATHS} from "util/config";
import {cleanup, fireEvent, screen, waitFor} from "@testing-library/react";
import {useHistory} from "react-router-dom";
import {UserMocks} from "test/mocks/user.mock";
import {v4} from "uuid";

beforeAll(async () => {
    await setupFirebase();
});

afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', () => {
    customRender(<Login/>);
});

describe('redirects if signed in', () => {
    beforeAll(async () => await signIn());
    afterAll(async () => await resetFirebase(true));

    it('redirects to base path if no history', async () => {
        await load();
        expect(window.location.pathname).toBe(PATHS.public.base);
    });

    it('redirects to base path if from login', async () => {
        await load(PATHS.public.login);
        expect(window.location.pathname).toBe(PATHS.public.base);
    });

    it('redirects to history', async () => {
        await load(PATHS.public.newPost);
        expect(window.location.pathname).toBe(PATHS.public.newPost);
    });
})

describe('signs in with email/password', () => {
    beforeEach(() => load());
    afterEach(async () => await resetFirebase(true));

    it('renders all fields', () => {
        screen.getByText('Email');
        screen.getByText('Password');
        screen.getByText('Sign In');
    });

    it('signs in successfully', async () => {
        fireEvent.change(screen.getByLabelText('email'), {target: {value: UserMocks.defaultUser.email}});
        fireEvent.change(screen.getByLabelText('password'), {target: {value: UserMocks.defaultUser.password}});
        fireEvent.click(screen.getByLabelText('sign-in'));
        await waitFor(() => expect(getFirebase().auth().currentUser?.email).toBe(UserMocks.defaultUser.email));
    })

    it('redirect successfully', async () => {
        await cleanup();
        await load(PATHS.public.newPost);
        fireEvent.change(screen.getByLabelText('email'), {target: {value: UserMocks.defaultUser.email}});
        fireEvent.change(screen.getByLabelText('password'), {target: {value: UserMocks.defaultUser.password}});
        fireEvent.click(screen.getByLabelText('sign-in'));
        await waitFor(() => expect(window.location.pathname).toBe(PATHS.public.newPost));
    })

    it('does not sign in with invalid email', async () => {
        fireEvent.change(screen.getByLabelText('email'), {target: {value: 'bad email'}});
        fireEvent.change(screen.getByLabelText('password'), {target: {value: UserMocks.defaultUser.password}});
        fireEvent.click(screen.getByLabelText('sign-in'));
        await waitFor(() => screen.getByText('The email address is badly formatted.'));
    })

    it('resets', () => {
    }); //Not sure what's going on, but cleanup doesn't work without this.

    it('does not sign in with invalid password', async () => {
        fireEvent.change(screen.getByLabelText('email'), {target: {value: UserMocks.defaultUser.email}});
        fireEvent.change(screen.getByLabelText('password'), {target: {value: 'bad password'}});
        fireEvent.click(screen.getByLabelText('sign-in'));
        await waitFor(() => screen.getByText('The password is invalid or the user does not have a password.'));
    });

    it('resets again', () => {
    }); //Not sure what's going on, but cleanup doesn't work without this.
});

describe('sign in with google', () => {

    beforeEach(() => load());
    afterEach(async () => await resetFirebase(true));

    it('renders all fields', () => {
        screen.getByText('Sign in with Google');
    });

    it('signs in successfully', async () => {
        googleSignIn();
        await waitFor(() => expect(getFirebase().auth().currentUser?.email).toBe(UserMocks.defaultUser.email));
    });

    it('redirect successfully', async () => {
        await cleanup();
        await load(PATHS.public.newPost);
        await googleSignIn();
        await waitFor(() => expect(window.location.pathname).toBe(PATHS.public.newPost));
    });

    async function googleSignIn() {
        getFirebase().auth().signInWithPopup = jest.fn().mockImplementation(() => {
            const {getFirebase: fb} = require("test/utils");
            const {UserMocks: UM} = require("test/mocks/user.mock");
            return fb().auth().signInWithEmailAndPassword(UM.defaultUser.email, UM.defaultUser.password);
        });
        fireEvent.click(screen.getByText('Sign in with Google'));
        await getFirebase().auth().currentUser;
    }
});

describe('register with email/password', () => {
    beforeEach(async () => {
        await load();
        fireEvent.click(screen.getByText('Register'));
    });
    afterEach(async () => await resetFirebase(true));

    it('renders all fields if register is selected', () => {
        screen.getByText('Name');
        screen.getByText('Email');
        screen.getByText('Password');
        screen.getByText('Confirm Password');
        screen.getByText('Register');
        screen.getByText('Sign in with Google');
    });

    it('creates user successfully', async () => {
        const email = createUser();
        await waitFor(() => expect(getFirebase().auth().currentUser?.email).toBe(email));
    });

    it('updates name', async () => {
        createUser();
        await waitFor(() => expect(getFirebase().auth().currentUser?.displayName).toBe('name'));
    });

    it('reports firebase error', async () => {
        createUser(true);
        await waitFor(() => screen.getByText('Passwords do not match.'));
    });

    function createUser(invalid?: boolean) {
        const email = v4() + '@email.com';
        fireEvent.change(screen.getByLabelText('name'), {target: {value: 'name'}});
        fireEvent.change(screen.getByLabelText('email'), {target: {value: email}});
        fireEvent.change(screen.getByLabelText('password'), {target: {value: 'password'}});
        fireEvent.change(screen.getByLabelText('password-confirm'), {target: {value: invalid ? 'bad password' : 'password'}});
        fireEvent.click(screen.getByLabelText('register'));
        return email;
    }

});

async function load(referrer?: string) {
    customRender(<HistoryWrapper referrer={referrer}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
}

const HistoryWrapper = ({referrer}: { referrer?: string }) => {
    const history = useHistory();
    history.replace(PATHS.public.login, {referrer: referrer});
    return (<Login/>);
}