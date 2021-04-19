import React from 'react';
import firebase from "firebase/app";
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useFirestoreCollectionData} from "reactfire";
import {OfferInterface} from "util/types";
import Offer from "../Offer.lazy";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    container: {
        maxWidth: 'sm',
        alignItems: 'flex-start',
        paddingBottom: theme.spacing(2),
    },
    card: {
        display: "inline-block",
    },
}));

const OfferList = ({offersRef}: { offersRef: firebase.firestore.Query }) => {
    const classes = useStyles();
    const {data: offers} = useFirestoreCollectionData<OfferInterface>(offersRef);

    if (!offers || offers.length === 0) return <></>;

    return (
        <Container className={classes.container} maxWidth="md">
            <Grid container
                  alignItems="center"
                  justify="space-evenly"
                  spacing={2}
                  className={classes.container}>
                {offers.map((offer: OfferInterface) => (<Offer key={offer.id} {...offer}/>))}
            </Grid>
        </Container>
    );
}

export default OfferList;
