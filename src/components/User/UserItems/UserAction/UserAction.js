import React, {useState} from 'react';
import {makeStyles} from "@material-ui/styles";
import {Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";
import {FirestoreMutation} from "@react-firebase/firestore";
import {collections} from "../../../../config";
import Alert from '@material-ui/lab/Alert';

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
            background: theme.palette.error.secondary,
        }
    },
}));

const UserAction = ({id}) => {
    const classes = useStyles();
    const path = collections.items + id;

    const [deleteAlert, setDeleteAlert] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);

    const clickDelete = () => setDeleteAlert(true);
    const closeDeleteAlert = (runMutation) => {
        setDeleteAlert(false);
        if (runMutation) {
            runMutation({
                active: false,
            }).then(() => setSuccess(true))
                .catch(error => {
                    console.error(error);
                    setFail(true);
                })
        }
    };
    const closeSnackbar = () => {
        setSuccess(false);
        setFail(false);
    }

    return (
        <>
            <CardActions disableSpacing>
                <IconButton aria-label="edit item" color="primary">
                    <Edit/>
                </IconButton>
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
                    <Button onClick={closeDeleteAlert} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <FirestoreMutation type="update" path={path}>
                        {({runMutation}) => (
                            <Button onClick={() => closeDeleteAlert(runMutation)} variant="contained" className={classes.confirmDelete}>
                                Delete
                            </Button>
                        )}
                    </FirestoreMutation>
                </DialogActions>
            </Dialog>
            <Snackbar open={success} autoHideDuration={3000} onClose={closeSnackbar}>
                <Alert variant="filled" severity="error" onClose={closeSnackbar}>Item failed to delete.</Alert>
            </Snackbar>
            <Snackbar open={fail} autoHideDuration={3000} onClose={closeSnackbar}>
                <Alert variant="filled" severity="error" onClose={closeSnackbar}>Item failed to delete.</Alert>
            </Snackbar>
        </>
    )
};

export default UserAction;
