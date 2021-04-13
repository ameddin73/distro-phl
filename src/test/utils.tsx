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
    const firebaseConfig = FIREBASE_CONFIG;
    firebaseConfig.projectId = PROJECT_ID;
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseApp.firestore().useEmulator('localhost', 8080);
    firebaseApp.auth().useEmulator('http://localhost:9099');
}

export async function resetFirebase(signOut?: boolean) {
    const firestore = firebaseApp.firestore();
    await firestore.terminate();
    await firestore.clearPersistence();
    firebaseApp.firestore().useEmulator('localhost', 8080);

    if (signOut) await firebase.auth().signOut();
}

export async function teardownFirebase() {
    await resetFirebase(true);
    await firebaseApp.delete();
}

export function getFirebase() {
    return firebaseApp;
}

export const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, {wrapper: Providers, ...options});

export function signIn(user: UserMocks.UserType = UserMocks.defaultUser) {
    return firebaseApp.auth().signInWithEmailAndPassword(user.email, user.password);
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