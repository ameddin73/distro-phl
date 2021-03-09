import {CircularProgress} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    },
    loading: {
        position: 'absolute',
        top: '25%',
    },
}));

export const Loading = () => {
    const classes = useStyles();

    return (
        <div>
            <CircularProgress className={classes.loading}/>
        </div>
    )
};