import React, {useContext, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import {PostProps} from "../../Common/Post/PostCard/PostCard";
import {SnackbarContext} from "../../Common/SnackbarProvider/SnackbarProvider";
import useInput from "util/hooks/useInput";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {COLLECTIONS, PATHS} from "util/config";
import {Converters, OfferQuery} from "util/utils";
import {useUser} from "reactfire";
import {useHistory, useLocation} from "react-router-dom";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import {Offer as OfferType, OfferInterface} from "util/types";
import Offer from "../../Common/Offer/Offer.lazy";
import {actionStyles} from "../../User/UserPosts/UserAction/UserAction";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    offer: {
        width: '100%',
        marginTop: theme.spacing(2),
        padding: theme.spacing(1),
    },
    error: {
        paddingLeft: theme.spacing(3),
    },
}));

const ExistingOffer = (offer: OfferInterface) => {
    const classes = useStyles();
    const actionClasses = actionStyles();
    const {documentRef} = offer;

    const [deleteAlert, setDeleteAlert] = useState(false);
    const openSnackbar = useContext(SnackbarContext);

    const clickDelete = () => setDeleteAlert(true);
    const closeDeleteAlert = (doDelete: boolean) => {
        setDeleteAlert(false);
        if (doDelete) {
            documentRef.delete()
                .then(() => {
                    openSnackbar('success', 'Deleted Successfully.');
                })
                .catch((error: Error) => {
                    console.error(error);
                    openSnackbar('error', 'Post failed to delete.');
                });
        }
    };

    return (
        <>
            <Offer {...offer}/>
            <Button variant="contained" onClick={clickDelete} aria-label="offer-button" color="primary" className={classes.offer}>
                Delete Response
            </Button>
            <Dialog
                maxWidth="sm"
                open={deleteAlert}
                onClose={() => closeDeleteAlert(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{"Are you sure you want to delete this response?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You can respond again after this one is deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeDeleteAlert(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => closeDeleteAlert(true)} variant="contained" className={actionClasses.confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const MakeOffer = ({post}: PostProps) => {
    const classes = useStyles();

    const openSnackbar = useContext(SnackbarContext);
    const history = useHistory();
    const location = useLocation();
    const {data: user} = useUser();

    const [offerAlert, setOfferAlert] = useState(false);
    const {value: message, bind: bindMessage} = useInput('');
    const messageLength = 10;

    const [newOffer] = useFirestoreAdd(COLLECTIONS.offers, Converters.OfferConverter, post.documentRef);

    const clickOffer = () => {
        if (user) {
            setOfferAlert(true);
        } else {
            history.push(PATHS.public.login, {from: location});
        }
    }
    const closeOfferAlert = async (doOffer: boolean) => {
        if (doOffer) {
            if (!message || message.length <= messageLength) {
                return;
            }
            setOfferAlert(false);
            const offer: OfferType = {
                posterId: post.uid,
                postId: post.id,
                offerId: user.uid,
                userName: user.displayName || 'Distro User', // TODO we don't love this
                message: message,
            }
            try {
                await newOffer(offer as OfferInterface);
                openSnackbar('success', 'Response sent.')
                history.go(0); // TODO this is a bad solution but i can't figure
                // out how to force a refresh
            } catch (error) {
                console.error(error);
                openSnackbar('error', 'Response failed to send.')
            }
        } else {
            setOfferAlert(false);
        }
    };

    return (
        <>
            <Button variant="contained" onClick={clickOffer} aria-label="offer-button" color="primary" className={classes.offer}>
                Respond to {post.userName}
            </Button>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={offerAlert}
                onClose={() => closeOfferAlert(false)}
                aria-labelledby="offer-dialog-title"
                aria-describedby="offer-dialog-description">
                <DialogTitle id="offer-dialog-title">{`Let ${post.userName} know you're interested`}</DialogTitle>
                <DialogContent>
                    <TextField
                        {...bindMessage}
                        id="message-to-poster"
                        label="Message to poster"
                        rows={3}
                        multiline
                        variant="outlined"
                        fullWidth
                        helperText={`${message.length < messageLength ? messageLength - message.length : 0} more characters required`}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeOfferAlert(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => closeOfferAlert(true)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const DistroAction = ({post}: PostProps) => {
    const {data: user} = useUser();
    const userId = user ? user.uid : 'no-auth';
    const {data: offers} = useFirestoreCollectionBuilder(COLLECTIONS.offers,
        {where: [OfferQuery.where.userOffer(userId)]},
        Converters.OfferConverter,
        post.documentRef);

    if (offers.length !== 0) {
        return <ExistingOffer {...offers[0]}/>;
    } else {
        return <MakeOffer post={post}/>;
    }
};

export default DistroAction;
