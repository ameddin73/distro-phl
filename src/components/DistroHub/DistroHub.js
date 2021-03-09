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
    const path = process.env.REACT_APP_DISTRO_HUB_COLLECTION;
    console.log(path)

    // Assign ids to value objects and reduce on user+name
    //TODO subtract reservations
    const unMarshall = ({ids, value}) => {
        value.forEach((item, index) => {
            item.id = ids[index]
            item.count = item.count - item.reserved;
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
                    <FirestoreCollection path={path} orderBy={[{field: 'created', type: 'asc'}]} limit={25}>
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
