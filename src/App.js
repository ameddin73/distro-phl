import React, {useState} from 'react';
import {Button, Typography} from '@material-ui/core';
import firebase from "firebase/app";
import 'firebase/auth';
import {FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";

function App({config}) {
    const [user, setUser] = useState({displayName: 'user'});
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

    const onSignIn = () => {
        firebase.auth().signInWithPopup(googleAuthProvider)
            .then(({user}) => setUser(user))
    }

    return (
        <FirebaseAuthProvider {...config} firebase={firebase}>
            <div>
                <IfFirebaseUnAuthed>
                    <Button variant="contained" color="primary" onClick={onSignIn}>Sign In with Google</Button>
                </IfFirebaseUnAuthed>
                <IfFirebaseAuthed>
                    <div>
                        <Typography variant="h6" gutterBottom>
                            Welcome, {user.displayName}!
                        </Typography>
                        <Button variant="contained" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
                    </div>
                </IfFirebaseAuthed>
            </div>
        </FirebaseAuthProvider>
    )
}

export default App;
