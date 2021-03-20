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
import {FirebaseAppProvider} from "reactfire";
import {ErrorBoundary, FallbackProps} from "react-error-boundary";
import ErrorMessage from "./components/Common/ErrorMessage";

const routes: RouteType = {};
routes[PATHS.public.distro] = () => <DistroHub/>;
routes[PATHS.public.user] = () => <User/>

function ErrorFallback({error}: FallbackProps) {
    return (<ErrorMessage message={error.message}/>);
}

function App({config}: { config: Object }) {
    useRedirect(PATHS.public.base, PATHS.public.distro);
    const routeResult = useRoutes(routes) || routes[PATHS.public.distro];

    return (
        <ThemeProvider theme={theme}>
            <FirebaseAppProvider firebaseConfig={config} suspense={true}>
                <TopBar/>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {routeResult}
                </ErrorBoundary>
            </FirebaseAppProvider>
        </ThemeProvider>
    )
}

export default App;
