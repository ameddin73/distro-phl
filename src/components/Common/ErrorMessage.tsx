import React from 'react';
import {Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {FallbackProps} from "react-error-boundary";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

const ErrorMessage = ({error}: FallbackProps) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            <Grid container direction="column" alignItems="center" alignContent="center" spacing={2} className={classes.body}>
                <Grid item xs>
                    <Typography role="alert" variant="h5" color="primary" align="center">{error.message}</Typography>
                </Grid>
                <Grid item xs>
                    <Button variant="contained" color="primary"
                            onClick={() => history.go(0)}>Try Again</Button>
                </Grid>
            </Grid>
        </>
    )
};

export default ErrorMessage;