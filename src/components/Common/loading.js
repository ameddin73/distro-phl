import {CircularProgress} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    loading: {
        position: 'absolute',
        left: '50%',
        top: '25%',
    },
});

export const Loading = () => {
    const classes = useStyles();

    return (
        <div>
            <CircularProgress className={classes.loading}/>
        </div>
    )
};