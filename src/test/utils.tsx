import React, {PropsWithChildren, Suspense} from "react";
import {ThemeProvider} from "@material-ui/styles";
import {FirebaseAppProvider} from "reactfire";
import {FIREBASE_CONFIG} from "util/config";
import theme from "util/theme";
import {render, RenderOptions, screen} from "@testing-library/react";
import SnackbarProvider from "../components/Common/SnackbarProvider/SnackbarProvider";
import Loading from "../components/Common/Loading";
import {BrowserRouter as Router} from "react-router-dom";
import {UserMocks} from "./mocks/user.mock";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const PROJECT_ID = `${process.env.TEST_PROJECT}`;
let firebaseApp: firebase.app.App;
let firestore: firebase.firestore.Firestore;
let auth: firebase.auth.Auth;

jest.setTimeout(10000);
// Mock storage
// @ts-ignore
jest.mock('rxfire/storage', () => ({
    ...jest.requireActual('rxfire/storage'),
    getDownloadURL: () => {
        const {Observable} = require('rxjs');
        return new Observable((subscriber: any) => {
            subscriber.next('public/logo192.png'); // TODO local default image
        });
    }
}));

export function setupFirebase() {
    firebaseApp = firebase.initializeApp({apiKey: FIREBASE_CONFIG.apiKey, projectId: PROJECT_ID, storageBucket: 'fake-bucket'});
    firestore = firebaseApp.firestore();
    auth = firebaseApp.auth();
    firestore.useEmulator('localhost', 8080);
    auth.useEmulator('http://localhost:9099');
}

export async function resetFirebase(signOut?: boolean) {
    await firestore.terminate();
    await firestore.clearPersistence();
    firestore = firebaseApp.firestore();
    firestore.useEmulator('localhost', 8080);

    if (signOut) await auth.signOut();
}

export async function teardownFirebase() {
    await new Promise(r => setTimeout(r, 5000)) // TODO this hack solves a socket issue i'm not smart enough to fix
    await firestore.terminate();
    await firestore.clearPersistence();
    await auth.signOut();
    await firebaseApp.delete();
    for (const app of firebase.apps) {
        await app.delete();
    }
}

export function getFirebase() {
    return firebaseApp;
}

export const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, {wrapper: Providers, ...options});

export function signIn(user: UserMocks.UserType = UserMocks.defaultUser) {
    return auth.signInWithEmailAndPassword(user.email, user.password);
}

export const rendersNothingHere = () => {
    screen.getByText('Oops, theres nothing here.');
    screen.getByText('Make a Post');
}

const Providers = ({children}: PropsWithChildren<any>) => (
    <ThemeProvider theme={theme}>
        <FirebaseAppProvider firebaseApp={firebaseApp} suspense>
            <SnackbarProvider>
                <Router>
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>
                </Router>
            </SnackbarProvider>
        </FirebaseAppProvider>
    </ThemeProvider>
);