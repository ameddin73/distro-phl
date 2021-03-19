import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import theme from "./util/theme";
import TopBar from "./components/Common/TopBar/TopBar.lazy";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
// @ts-ignore
import {useRedirect, useRoutes} from "hookrouter";
import {paths} from "./util/config";
import User from "./components/User/User.lazy";
import {RouteType} from "./util/types";
import {FirebaseAppProvider} from "reactfire";

const routes: RouteType = {};
routes[paths.public.distro] = () => <DistroHub/>;
routes[paths.public.user] = () => <User/>

function App({config}: { config: Object }) {
    useRedirect(paths.public.base, paths.public.distro);
    const routeResult = useRoutes(routes) || routes[paths.public.distro];

    return (
        <ThemeProvider theme={theme}>
            <FirebaseAppProvider firebaseConfig={config} suspense={true}>
                <TopBar/>
                {routeResult}
            </FirebaseAppProvider>
        </ThemeProvider>
    )
}

export default App;
