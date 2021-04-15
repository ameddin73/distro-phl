import React, {useContext, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {SnackbarContext} from "../../../Common/SnackbarProvider/SnackbarProvider";
import {PostProps} from "../../../Common/Post/PostCard/PostCard";
import {useHistory} from "react-router-dom";
import {PATHS} from "../../../../util/config";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    delete: {
        marginLeft: 'auto'
    },
    confirmDelete: {
        background: theme.palette.error.main,
        '&:hover': {
            background: theme.palette.error.light,
        }
    },
}));

const UserAction = ({post}: PostProps) => {
    const classes = useStyles();

    const [deleteAlert, setDeleteAlert] = useState(false);
    const openSnackbar = useContext(SnackbarContext);
    const history = useHistory();

    const clickDelete = () => setDeleteAlert(true);
    const closeDeleteAlert = (doDelete: boolean) => {
        setDeleteAlert(false);
        if (doDelete) {
            post.setActive(false)
                .then(() => {
                    openSnackbar('success', 'Deleted Successfully.');
                    history.replace(PATHS.public.userPosts);
                })
                .catch(error => {
                    console.error(error);
                    openSnackbar('error', 'Post failed to delete.');
                });
        }
    };

    return (
        <>
            <CardActions disableSpacing>
                <IconButton onClick={clickDelete} aria-label="delete" className={classes.delete} color="primary">
                    <Delete/>
                </IconButton>
            </CardActions>
            <Dialog
                open={deleteAlert}
                onClose={closeDeleteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this item?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This can't be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeDeleteAlert(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => closeDeleteAlert(true)} variant="contained" className={classes.confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default UserAction;
