import React from 'react';
import {makeStyles} from "@material-ui/styles";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    buttons: {
        padding: theme.spacing(0),
        maxHeight: 26,
    },
}));

const UserAction = () => {
    // const classes = useStyles();

    return (
        <div>
            <Button>Edit</Button>
        </div>
    )
};

export default UserAction;
