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
        padding: theme.spacing(2),
        alignItems: 'flex-start',
    },
    card: {
        display: "inline-block",
    },
}));

const DistroHub = () => {
    const classes = useStyles();

    // Assign ids to value objects and reduce on user+name
    const unMarshall = ({ids, value}) => {
        value.forEach((item, index) => {
            item.id = ids[index]
            item.count = item.expiries.length;
        });
        return value;
    }

    return (
        <div>
            <Container className={classes.container} maxWidth="md">
                <Grid container
                      alignItems="center"
                      justify="center"
                      spacing={2}
                      className={classes.container}>
                    <FirestoreCollection path={process.env.REACT_APP_FIREBASE_FIRESTORE_COLLECTION} orderBy={[{field: 'expiries', type: 'asc'}]} limit={25}>
                        {({isLoading, ...rest}) => {
                            return isLoading ? "Loading" : (
                                unMarshall(rest).map((item) => {
                                    return (
                                        <DistroItem key={item.name} item={item}/>
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
