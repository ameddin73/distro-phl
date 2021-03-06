import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import {FirebaseAuthProvider} from "@react-firebase/auth";
import {FirestoreProvider} from "@react-firebase/firestore";
import theme from "./theme";
import Common from "./components/Common/Common.lazy";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
import {useRoutes} from "hookrouter";
import Login from "./components/Common/User/Login/Login.lazy";

const routes = {
    '/': () => <DistroHub/>,
    '/login': () => <Login/>,
}

function App({config}) {
    const routeResult = useRoutes(routes);

    return (
        <div>
            <ThemeProvider theme={theme}>
                <FirestoreProvider {...config} firebase={firebase}>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <Common/>
                        {routeResult || routes['/']}
                    </FirebaseAuthProvider>
                </FirestoreProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;
