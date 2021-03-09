import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import {FirebaseAuthProvider} from "@react-firebase/auth";
import {FirestoreProvider} from "@react-firebase/firestore";
import theme from "./theme";
import TopBar from "./components/Common/TopBar/TopBar.lazy";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
import {useRoutes} from "hookrouter";
import {useRedirect} from 'hookrouter';
import {paths} from "./components/Common/config";
import User from "./components/User/User.lazy";

const routes = {};
routes[paths.public.distro] = () => <DistroHub/>;
routes[paths.public.user] = () => <User/>

function App({config}) {
    useRedirect(paths.public.base, paths.public.distro);
    const routeResult = useRoutes(routes) || routes[paths.public.distro];

    return (
        <div>
            <ThemeProvider theme={theme}>
                <FirestoreProvider {...config} firebase={firebase}>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <TopBar/>
                        {routeResult}
                    </FirebaseAuthProvider>
                </FirestoreProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;
