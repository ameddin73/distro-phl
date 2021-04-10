import {CircularProgress} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {
        marginTop: '25%'
    }
});

const Loading = () => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <CircularProgress id="loading" className={classes.progress}/>
        </div>
    )
};

export default Loading;