import React, {Suspense} from 'react';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
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
import Loading from "./components/Common/Loading/Loading";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SnackbarProvider from "./components/Common/SnackbarProvider/SnackbarProvider";
import Post from "./components/Common/Post/Post";
import NotFound from "./components/Common/NotFound";

function App({config}: { config: Object }) {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <FirebaseAppProvider firebaseConfig={config} suspense>
                <ErrorBoundary FallbackComponent={ErrorMessage}>
                    <Router>
                        <TopBar/>
                        <Suspense fallback={<Loading marginTop='40vh'/>}>
                            <ErrorBoundary FallbackComponent={ErrorMessage}>
                                <SnackbarProvider>
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
