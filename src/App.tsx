import React, {Suspense} from 'react';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import theme from "util/theme";
import TopBar from "./components/Common/TopBar/TopBar";
import DistroHub from "./components/DistroHub/DistroHub";
import {PATHS} from "util/config";
import User from "./components/User/User";
import {FirebaseAppProvider, preloadAuth, preloadFirestore, preloadStorage, preloadUser, useFirebaseApp} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import ErrorMessage from "./components/Common/ErrorMessage";
import Loading from "./components/Common/Loading/Loading";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Post from "./components/Common/Post/Post";
import NotFound from "./components/Common/NotFound";
import firebase from "firebase/app";

const PreloadApp = () => {
    const firebaseApp = useFirebaseApp();
    preloadSDKs(firebaseApp);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <ErrorBoundary FallbackComponent={ErrorMessage}>
                <Router>
                    <TopBar/>
                    <Suspense fallback={<Loading marginTop='40vh'/>}>
                        <ErrorBoundary FallbackComponent={ErrorMessage}>
                                <div style={{marginTop: theme.spacing(6)}}>
                                    <Switch>
                                        <Route path={PATHS.public.user}>
                                            <User/>
                                        </Route>
                                        <Route path={PATHS.public.distro}>
                                            <DistroHub/>
                                        </Route>
                                        <Route path={`${PATHS.public.posts}/:id`}>
                                            <Post/>
                                        </Route>
                                        <Route path={PATHS.public.base}>
                                            <DistroHub/>
                                        </Route>
                                        <Route>
                                            <NotFound/>
                                        </Route>
                                    </Switch>
                                </div>
                        </ErrorBoundary>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    )
}

function App({config}: { config: Object }) {
    return (
        <FirebaseAppProvider firebaseConfig={config} suspense>
            <PreloadApp/>
        </FirebaseAppProvider>
    )
}

/*
Preload reactfire components to prevent unexpected suspense
 */
function preloadSDKs(firebaseApp: firebase.app.App) {
    return Promise.all([
        preloadFirestore({
            firebaseApp,
            setup(firestore) {
                return firestore().enablePersistence();
            }
        }),
        preloadStorage({
            firebaseApp,
            setup(storage) {
                return storage().setMaxUploadRetryTime(10000);
            }
        }),
        preloadAuth({firebaseApp}),
        preloadUser({firebaseApp})]);
}

export default App;
