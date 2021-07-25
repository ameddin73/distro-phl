import React, {PropsWithChildren, Suspense} from "react";
import {ThemeProvider} from "@material-ui/styles";
import {FirebaseAppProvider} from "reactfire";
import {FIREBASE_CONFIG} from "util/config";
import theme from "util/theme";
import {render, RenderOptions, screen, waitFor} from "@testing-library/react";
import {BrowserRouter as Router, useHistory} from "react-router-dom";
import {UserMocks} from "./mocks/user.mock";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const PROJECT_ID = `${process.env.DEMO_PROJECT}`;
let firebaseApp: firebase.app.App;
let firestore: firebase.firestore.Firestore;
let storage: firebase.storage.Storage;
let auth: firebase.auth.Auth;

export function setupFirebase() {
    firebaseApp = firebase.initializeApp({apiKey: FIREBASE_CONFIG.apiKey, projectId: PROJECT_ID, storageBucket: `default-bucket`});

    firestore = firebaseApp.firestore();
    storage = firebaseApp.storage();
    auth = firebaseApp.auth();

    firestore.useEmulator('localhost', 8080);
    storage.useEmulator('localhost', 9199)
    auth.useEmulator('http://localhost:9099');
}

export async function resetFirebase(doSignOut?: boolean) {
    if (doSignOut) await auth.signOut();
}

export async function teardownFirebase() {
    await firestore.terminate();
    await auth.signOut();
    await firebaseApp.delete();
}

export function getFirebase() {
    return firebaseApp;
}

export const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, {wrapper: Providers, ...options});

export const waitForSuspendedRender = async (ui: React.ReactElement, options?: RenderOptions) => {
    customRender(ui, options);
    await waitFor(() =>
        // @ts-ignore
        expect(document.querySelector(`#${ui.type.name}`)).toBeNull());
}

export function signIn(user: UserMocks.UserType = UserMocks.defaultUser) {
    return auth.signInWithEmailAndPassword(user.email, user.password);
}

export function signOut() {
    return auth.signOut();
}

export const rendersNothingHere = () => {
    screen.getByText('Oops, theres nothing here.');
    screen.getByText('Make a Post');
}

const Providers = ({children}: PropsWithChildren<any>) => (
    <ThemeProvider theme={theme}>
        <FirebaseAppProvider firebaseApp={firebaseApp} suspense>
            <Router>
                <Suspense fallback={<div id={children.type.name}/>}>
                    {children}
                </Suspense>
            </Router>
        </FirebaseAppProvider>
    </ThemeProvider>
);

export const HistoryWrapper = ({component, path, referrer}: { component: JSX.Element, path: string, referrer?: string }) => {
    const history = useHistory();
    history.replace(path, {referrer: referrer});
    return (component);
}