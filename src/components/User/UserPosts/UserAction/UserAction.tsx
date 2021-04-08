import React, {useContext, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {ItemInterface} from "util/types";
import {Converters} from "util/utils";
import {SnackbarContext} from "../../../Common/SnackbarProvider/SnackbarProvider";
import useFirestoreUpdate from "util/hooks/useFirestoreUpdate";
import {COLLECTIONS} from "../../../../util/config";

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
            // @ts-ignore
            background: theme.palette.error.secondary,
        }
    },
}));

const UserAction = ({id}: ItemInterface) => {
    const classes = useStyles();

    const [deleteAlert, setDeleteAlert] = useState(false);
    const openSnackbar = useContext(SnackbarContext);
    const setInactive = useFirestoreUpdate(COLLECTIONS.posts, id, Converters.itemConverter);

    const clickDelete = () => setDeleteAlert(true);
    const closeDeleteAlert = (doDelete: boolean) => {
        setDeleteAlert(false);
        if (doDelete) {
            setInactive({active: false})
                .then(() => openSnackbar('success', 'Deleted Successfully.'))
                .catch(error => {
                    console.error(error);
                    openSnackbar('error', 'PostComponent failed to delete.');
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
