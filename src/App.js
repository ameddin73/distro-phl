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
import Login from "./components/User/Login/Login.lazy";
import UserItems from "./components/User/UserItems/UserItems.lazy";
import {useRedirect} from 'hookrouter';
import {paths} from "./components/Common/config";

const routes = {};
routes[paths.distro] = () => <DistroHub/>;
routes[paths.login] = () => <Login/>;
routes[paths.userItems] = () => <UserItems/>

function App({config}) {
    useRedirect(paths.base, paths.distro);
    const routeResult = useRoutes(routes) || routes[paths.distro];

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
