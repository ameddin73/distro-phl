import React, {lazy, Suspense} from 'react';
import {Card, Grid} from "@material-ui/core";
import {offerStyles} from "./Offer";
import {OfferInterface} from "util/types";
import Loading from "../Loading";

const LazyOffer = lazy(() => import('./Offer'));

const Offer = (offer: OfferInterface) => {
    const classes = offerStyles();
    return (
        <Grid item xs>
            <Card className={classes.card} variant="outlined" color="primary">
                <Suspense fallback={<Loading/>}>
                    <LazyOffer {...offer} />
                </Suspense>
            </Card>
        </Grid>
    )
};

export default Offer;
