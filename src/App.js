import React from 'react';
import {Button, ThemeProvider} from '@material-ui/core';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import {FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";
import {FirestoreProvider} from "@react-firebase/firestore";
import DistroHub from "./components/DistroHub/DistroHub.lazy";
import theme from "./theme";

function App({config}) {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

    return (
        <div>
            <ThemeProvider theme={theme}>
                <FirestoreProvider {...config} firebase={firebase}>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <IfFirebaseUnAuthed>
                            {({...rest}) => (
                                <div>
                                    <Button variant="contained" color="primary" onClick={() => {firebase.auth().signInWithRedirect(googleAuthProvider)}}>Sign In with Google</Button>
                                </div>
                            )}
                        </IfFirebaseUnAuthed>
                        <IfFirebaseAuthed>
                            {({user, ...rest}) => (
                                <div>
                                    <DistroHub user={user}/>
                                    <Button variant="contained" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
                                </div>
                            )}
                        </IfFirebaseAuthed>
                    </FirebaseAuthProvider>
                </FirestoreProvider>
            </ThemeProvider>
        </div>
    )
}

export default App;
