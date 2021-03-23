import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import theme from "./util/theme";
import TopBar from "./components/Common/TopBar/TopBar.lazy";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
import {PATHS} from "./util/config";
import User from "./components/User/User.lazy";
import {FirebaseAppProvider, SuspenseWithPerf} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import ErrorMessage from "./components/Common/ErrorMessage";
import Loading from "./components/Common/Loading";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App({config}: { config: Object }) {

    return (
        <ThemeProvider theme={theme}>
            <FirebaseAppProvider firebaseConfig={config} suspense={true}>
                <ErrorBoundary FallbackComponent={ErrorMessage}>
                    <Router>
                        <TopBar/>
                        <SuspenseWithPerf fallback={<Loading/>} traceId="app-load">
                            <ErrorBoundary FallbackComponent={ErrorMessage}>
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
                                </Switch>
                            </ErrorBoundary>
                        </SuspenseWithPerf>
                    </Router>
                </ErrorBoundary>
            </FirebaseAppProvider>
        </ThemeProvider>
    )
}

export default App;
