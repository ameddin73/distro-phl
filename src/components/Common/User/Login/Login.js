import React, {useState} from 'react';
import {Button, Card, Container, Divider, FormControl, Grid, Input, InputLabel, Typography} from "@material-ui/core";
import {IfFirebaseUnAuthed} from "@react-firebase/auth";
import {navigate} from 'hookrouter';
import firebase from "firebase/app";
import GoogleButton from "react-google-button";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        maxWidth: 'sm',
        justify: 'center',
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
    },
    button: {
        width: '240px',
    },
    divider: {
        padding: theme.spacing(0),
        alignItems: "center",
    },
}));

const Login = ({user}) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const classes = useStyles();

    // const [username, setUsername] = useState();
    // const [password, setPassword] = useState();

    if (Boolean(user)) navigate('/', true);
    return (
        <div>
            <IfFirebaseUnAuthed>
                {({...rest}) => (
                    <Container className={classes.container} maxWidth="sm">
                        <Grid container
                              direction="column"
                              alignContent="center"
                              spacing={2}
                              className={classes.container}>
                            <Card className={classes.card}>
                                <Grid container
                                      direction="column"
                                      alignContent="center"
                                      spacing={2}
                                      className={classes.container}>
                                    <Grid item xs>
                                        <FormControl>
                                            <InputLabel htmlFor="email">Email address</InputLabel>
                                            <Input id="email"/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs>
                                        <FormControl>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input type="password" id="password"/>
                                        </FormControl>
                                    </Grid>
                                    <Typography align="center" variant="subtitle2">Register</Typography>
                                    <Grid item xs>
                                        <Button className={classes.button} variant="outlined">Login</Button>
                                    </Grid>
                                    <Grid item xs>
                                        <Grid container spacing={0} className={classes.divider}>
                                            <Grid item xs>
                                                <Divider/>
                                            </Grid>
                                            <Grid item xs>
                                                <Typography align="center" variant="h6">or</Typography>
                                            </Grid>
                                            <Grid item xs>
                                                <Divider/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <GoogleButton
                                            onClick={() => {
                                                firebase.auth().signInWithRedirect(googleAuthProvider)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Container>
                )}
            </IfFirebaseUnAuthed>
        </div>
    );
}

export default Login;
