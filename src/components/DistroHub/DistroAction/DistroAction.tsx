import React, {useContext, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {PostProps} from "../../Common/Post/PostCard/PostCard";
import {SnackbarContext} from "../../Common/SnackbarProvider/SnackbarProvider";
import useInput from "util/hooks/useInput";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";
import {Offer, OfferInterface} from "../../Common/Post/types";
import {useFirestore, useUser} from "reactfire";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    offer: {
        width: '100%',
        padding: theme.spacing(2),
    },
}));

const DistroAction = ({post}: PostProps) => {
    const classes = useStyles();

    const openSnackbar = useContext(SnackbarContext);
    const firestore = useFirestore();
    const {data: user} = useUser();

    const [offerAlert, setOfferAlert] = useState(false);
    const {value: message, bind: bindMessage} = useInput();

    const postRef = firestore.collection(COLLECTIONS.posts).doc(post.id);
    const [newOffer] = useFirestoreAdd(COLLECTIONS.offers, Converters.OfferConverter, postRef);

    const clickOffer = () => setOfferAlert(true);
    const closeOfferAlert = async (doOffer: boolean) => {
        setOfferAlert(false);
        if (doOffer) {
            const offer: Offer = {
                posterId: post.uid,
                offerId: user.uid,
                userName: user.displayName || 'Distro User', // TODO we don't love this
                message: message,
            }
            try {
                await newOffer(offer as OfferInterface);
                openSnackbar('success', 'Offer sent.')
            } catch (error) {
                console.error(error);
                openSnackbar('error', 'Offer failed to send.')
            }
        }
    };

    return (
        <>
            <Button variant="contained" onClick={clickOffer} aria-label="offer-button" color="primary" className={classes.offer}>
                I'm Interested
            </Button>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={offerAlert}
                onClose={() => closeOfferAlert(false)}
                aria-labelledby="offer-dialog-title"
                aria-describedby="offer-dialog-description"
            >
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
                    />
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
};

export default DistroAction;
