import React from 'react';
import {CircularProgress, Container, Grid} from "@material-ui/core";
import {FirestoreCollection} from "@react-firebase/firestore";
import {makeStyles} from "@material-ui/styles";
import Item from "../Item/Item.lazy";

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
    loading: {
        position: 'absolute',
        top: '25%',
    },
}));

const ItemList = ({path, where, orderBy, unmarshal, itemAction}) => {
    const classes = useStyles();

    return (
        <div>
            <Container className={classes.container} maxWidth="md">
                <Grid container
                      alignItems="center"
                      justify="center"
                      spacing={2}
                      className={classes.container}>
                    <FirestoreCollection path={path} where={where} orderBy={orderBy} limit={25}>
                        {({isLoading, ...rest}) => {
                            return isLoading ? (
                                <div>
                                    <CircularProgress className={classes.loading}/>
                                </div>
                            ) : (
                                (rest.value === null) ?
                                    (
                                        <div/>
                                    ) : (
                                        unmarshal(rest).map((item) => {
                                            return (
                                                <Item key={item.id} item={item} itemAction={itemAction}/>
                                            )
                                        }))
                            )
                        }}
                    </FirestoreCollection>
                </Grid>
            </Container>
        </div>
    );
}

export default ItemList;
