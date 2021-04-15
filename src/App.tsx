import React, {Suspense} from 'react';
import {ThemeProvider} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import theme from "util/theme";
import TopBar from "./components/Common/TopBar/TopBar";
import DistroHub from "./components/DistroHub/DistroHub";
import {PATHS} from "util/config";
import User from "./components/User/User";
import {FirebaseAppProvider} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import ErrorMessage from "./components/Common/ErrorMessage";
import Loading from "./components/Common/Loading";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SnackbarProvider from "./components/Common/SnackbarProvider/SnackbarProvider";
import Post from "./components/Common/Post/Post";

function App({config}: { config: Object }) {

    return (
        <ThemeProvider theme={theme}>
            <FirebaseAppProvider firebaseConfig={config} suspense>
                <ErrorBoundary FallbackComponent={ErrorMessage}>
                    <Router>
                        <TopBar/>
                        <Suspense fallback={<Loading/>}>
                            <ErrorBoundary FallbackComponent={ErrorMessage}>
                                <SnackbarProvider>
                                    <Switch>
                                        <Route path={PATHS.public.user}>
                                            <User/>
                                        </Route>
                                        <Route path={PATHS.public.distro}>
                                            <DistroHub/>
                                        </Route>
                                        <Route path={PATHS.public.base}>
                                            <DistroHub/>
                                        </Route>
                                        <Route path={PATHS.public.posts + '/:id'}>
                                            <Post/>
                                        </Route>
                                    </Switch>
                                </SnackbarProvider>
                            </ErrorBoundary>
                        </Suspense>
                    </Router>
                </ErrorBoundary>
            </FirebaseAppProvider>
        </ThemeProvider>
    )
}

export default App;
