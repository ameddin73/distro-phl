import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import theme from "./util/theme";
import TopBar from "./components/Common/TopBar/TopBar.lazy";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
// @ts-ignore
import {useRedirect, useRoutes} from "hookrouter";
import {PATHS} from "./util/config";
import User from "./components/User/User.lazy";
import {RouteType} from "./util/types";
import {FirebaseAppProvider, SuspenseWithPerf} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import ErrorMessage from "./components/Common/ErrorMessage";
import Loading from "./components/Common/Loading";

const routes: RouteType = {};
routes[PATHS.public.distro] = () => <DistroHub/>;
routes[PATHS.public.user] = () => <User/>


function App({config}: { config: Object }) {
    useRedirect(PATHS.public.base, PATHS.public.distro);
    const routeResult = useRoutes(routes) || routes[PATHS.public.distro];

    return (
        <ThemeProvider theme={theme}>
            <FirebaseAppProvider firebaseConfig={config} suspense={true}>
                <ErrorBoundary FallbackComponent={ErrorMessage}>
                    <TopBar/>
                    <SuspenseWithPerf fallback={<Loading/>} traceId="app-load">
                        <ErrorBoundary FallbackComponent={ErrorMessage}>
                            {routeResult}
                        </ErrorBoundary>
                    </SuspenseWithPerf>
                </ErrorBoundary>
            </FirebaseAppProvider>
        </ThemeProvider>
    )
}

export default App;
