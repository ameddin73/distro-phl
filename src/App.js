import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import {FirebaseAuthProvider} from "@react-firebase/auth";
import {FirestoreProvider} from "@react-firebase/firestore";
import theme from "./theme";
import Common from "./components/Common/Common.lazy";

function App({config}) {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <FirestoreProvider {...config} firebase={firebase}>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <Common/>
                    </FirebaseAuthProvider>
                </FirestoreProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;
