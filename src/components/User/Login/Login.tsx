import React, {SyntheticEvent, useState} from 'react';
import {Button, Card, Divider, FormControl, Grid, Input, InputLabel, Link, Typography} from "@material-ui/core";
import GoogleButton from "react-google-button";
import {makeStyles} from "@material-ui/core/styles";
import {useInput} from "../../../util/hooks";
import {CustomTheme} from "../../../util/theme";
import firebase from "firebase";
import {useAuth, useUser} from "reactfire";
import {Redirect, useHistory, useLocation} from "react-router-dom";
import {PATHS} from "../../../util/config";

const useStyles = makeStyles((theme: CustomTheme) => ({
    root: {
        width: '100%',
        flexGrow: 1,
    },
    container: {
        justify: 'center',
        padding: theme.spacing(2),
    },
    card: {
        width: '100%',
        display: "inline-block",
    },
    button: {
        width: '100%',
        maxWidth: '240px',
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
    link: theme.link,
}));

type LocationState = {
    from: string,
};

const Login = () => {
    const classes = useStyles();

    const {state} = useLocation<LocationState>();
    const history = useHistory();
    const auth = useAuth();
    const user = useUser();
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

    const {value: email, bind: bindEmail, reset: resetEmail} = useInput('');
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput('');
    const {value: name, bind: bindName, reset: resetName} = useInput('');
    const {value: confirmPassword, bind: bindConfirmPassword, reset: resetConfirmPassword} = useInput('');
    const [error, setError] = useState('');
    const [registerOpen, setRegisterOpen] = useState(false);

    const submit = (event: SyntheticEvent) => {
        event.preventDefault();
        setError('')
        if (registerOpen) {
            if (password !== confirmPassword) {
                setError('Passwords do not match.')
                resetConfirmPassword();
            } else {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        const user = auth.currentUser;
                        if (user) user.updateProfile({displayName: name})
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            }
        } else {
            auth.signInWithEmailAndPassword(email, password)
                .catch((error) => {
                    setError(error.message);
                });
            history.push(state.from)
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
        <>
            {user.data ?
                <Redirect
                    to={{pathname: (state.from ? state.from : PATHS.public.base)}}/>
                :
                <Grid container
                      direction="column"
                      alignContent="center"
                      spacing={2}
                      className={classes.container}>
                    <Grid item xs>
                        <Card className={classes.card}>
                            <form onSubmit={submit}>
                                <Grid container
                                      direction="column"
                                      alignContent="center"
                                      spacing={2}
                                      className={classes.container}>
                                    {registerOpen &&
                                    <Grid item>
                                        <FormControl required={true} fullWidth>
                                            <InputLabel htmlFor="name">Name</InputLabel>
                                            <Input id="name" autoComplete="name" {...bindName}/>
                                        </FormControl>
                                    </Grid>
                                    }
                                    <Grid item xs>
                                        <FormControl required={true} fullWidth>
                                            <InputLabel htmlFor="email">Email address</InputLabel>
                                            <Input id="email" autoComplete="email" {...bindEmail}/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs>
                                        <FormControl required={true} fullWidth>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input type="password" id="password" autoComplete="new-password" {...bindPassword}/>
                                        </FormControl>
                                    </Grid>
                                    {registerOpen &&
                                    <Grid item xs>
                                        <FormControl required={true} fullWidth>
                                            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                            <Input type="password" id="confirmPassword" autoComplete="new-password" {...bindConfirmPassword}/>
                                        </FormControl>
                                    </Grid>
                                    }
                                    <Typography variant="subtitle2" className={classes.error} noWrap={false}>{error}</Typography>
                                    <Link className={classes.link} align="center" variant="subtitle2" underline="hover" onClick={clickRegister}>{registerOpen ? 'Sign In' : 'Register'}</Link>
                                    <Grid item xs>
                                        <Button type="submit" className={classes.button} variant="outlined">{registerOpen ? 'Register' : 'Sign In'}</Button>
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
                                            onClick={() => (auth.signInWithPopup(googleAuthProvider)
                                                    .then(() => history.push(state.from))
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            }
        </>
    );
}

export default Login;
