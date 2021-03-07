import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {FirestoreCollection} from "@react-firebase/firestore";
import {makeStyles} from "@material-ui/styles";
import DistroItem from "../Common/DistroItem/DistroItem.lazy";

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
        justify: 'center',
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
    },
}));

const DistroHub = () => {
    const classes = useStyles();

    return (
        <div>
            <Container className={classes.container} maxWidth="md">
                <Grid container
                      justify="center"
                      spacing={2}
                      className={classes.container}>
                    <FirestoreCollection path={process.env.REACT_APP_FIREBASE_FIRESTORE_COLLECTION} orderBy={[{field: 'created', type: 'asc'}]} limit={1000}>
                        {({isLoading, value}) => {
                            return isLoading ? "Loading" : (
                                value.map((item) => {
                                    return (
                                        <div key={item.name}>
                                            <DistroItem item={item}/>
                                        </div>
                                    )
                                })
                            )
                        }}
                    </FirestoreCollection>
                </Grid>
            </Container>
        </div>
    );
}

export default DistroHub;
