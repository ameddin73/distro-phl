import React, {useEffect, useState} from 'react';
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
import Login from "./components/Login/Login.lazy";

const routes = {
    '/': () => <DistroHub/>,
    '/login': () => <Login/>,
}

function App({config}) {
    const routeResult = useRoutes(routes) || routes['/'];

    const [component, setComponent] = useState(<div/>);

    useEffect(() => {
        setComponent(routeResult);
    });

    return (
        <div>
            <ThemeProvider theme={theme}>
                <FirestoreProvider {...config} firebase={firebase}>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <Common/>
                        {component}
                    </FirebaseAuthProvider>
                </FirestoreProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;
