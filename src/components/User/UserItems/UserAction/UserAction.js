import React from 'react';
import {makeStyles} from "@material-ui/styles";
import {CardActions, IconButton} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    delete: {
        marginLeft: 'auto'
    },
}));

const UserAction = () => {
    const classes = useStyles();

    return (
        <div>
            <CardActions disableSpacing>
                <IconButton aria-label="edit item">
                    <Edit/>
                </IconButton>
                <IconButton aria-label="delete" className={classes.delete}>
                    <Delete/>
                </IconButton>
            </CardActions>
        </div>
    )
};

export default UserAction;
