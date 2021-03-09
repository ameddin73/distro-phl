import React, {useState} from 'react';
import {Button, Card, Container, Divider, FormControl, Grid, Input, InputLabel, Link, Typography} from "@material-ui/core";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {navigate, useQueryParams} from 'hookrouter';
import firebase from "firebase/app";
import GoogleButton from "react-google-button";
import {makeStyles} from "@material-ui/styles";
import {useInput} from "../../Common/hooks";
import {paths} from "../../Common/config";

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
    error: {
        color: theme.palette.error.light,
        padding: theme.spacing(1),
        maxWidth: '240px',
    },
}));

const Login = () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const classes = useStyles();

    const {value: email, bind: bindEmail, reset: resetEmail} = useInput('');
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput('');
    const {value: name, bind: bindName, reset: resetName} = useInput('');
    const {value: confirmPassword, bind: bindConfirmPassword, reset: resetConfirmPassword} = useInput('');
    const [error, setError] = useState('');
    const [registerOpen, setRegisterOpen] = useState(false);
    const [queryParams] = useQueryParams();

    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : paths.distro;

    const submit = (event) => {
        event.preventDefault();
        setError('')
        if (registerOpen) {
            if (password !== confirmPassword) {
                setError('Passwords do not match.')
                resetConfirmPassword();
            } else {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        firebase.auth().currentUser.updateProfile({displayName: name});
                    })
                    .catch((error) => {
                        setError(error.message);
                    })
            }
        } else {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch((error) => {
                    setError(error.message);
                });
        }
    }

    const clickRegister = () => {
        resetEmail();
        resetPassword();
        resetName();
        resetConfirmPassword();
        setRegisterOpen(!registerOpen);
    }

    return (
        <div>
            <FirebaseAuthConsumer>
                {({isSignedIn}) => {
                    if (isSignedIn === true) {
                        navigate(redirect, true);
                    } else {
                        return (
                            <div>
                                <Container className={classes.container} maxWidth="sm">
                                    <Grid container
                                          direction="column"
                                          alignContent="center"
                                          spacing={2}
                                          className={classes.container}>
                                        <Card className={classes.card}>
                                            <form onSubmit={submit}>
                                                <Grid container
                                                      direction="column"
                                                      alignContent="center"
                                                      spacing={2}
                                                      className={classes.container}>
                                                    {registerOpen &&
                                                    <Grid item>
                                                        <FormControl required={true}>
                                                            <InputLabel htmlFor="password">Name</InputLabel>
                                                            <Input id="name" {...bindName}/>
                                                        </FormControl>
                                                    </Grid>
                                                    }
                                                    <Grid item xs>
                                                        <FormControl required={true}>
                                                            <InputLabel htmlFor="email">Email address</InputLabel>
                                                            <Input id="email" {...bindEmail}/>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <FormControl required={true}>
                                                            <InputLabel htmlFor="password">Password</InputLabel>
                                                            <Input type="password" id="password" {...bindPassword}/>
                                                        </FormControl>
                                                    </Grid>
                                                    {registerOpen &&
                                                    <Grid item xs>
                                                        <FormControl required={true}>
                                                            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                                            <Input type="password" id="confirmPassword" {...bindConfirmPassword}/>
                                                        </FormControl>
                                                    </Grid>
                                                    }
                                                    <Typography variant="subtitle2" className={classes.error} noWrap={false}>{error}</Typography>
                                                    <Link align="center" variant="subtitle2" underline="hover" className={classes.link} onClick={clickRegister}>{registerOpen ? 'Login' : 'Register'}</Link>
                                                    <Grid item xs>
                                                        <Button type="submit" className={classes.button} variant="outlined">{registerOpen ? 'Register' : 'Login'}</Button>
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
                                                                firebase.auth().signInWithPopup(googleAuthProvider)
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </Card>
                                    </Grid>
                                </Container>
                            </div>
                        )
                    }
                }}
            </FirebaseAuthConsumer>
        </div>
    );
}

export default Login;
