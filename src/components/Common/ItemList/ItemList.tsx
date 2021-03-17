import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {FirestoreCollection} from "@react-firebase/firestore";
import {makeStyles} from "@material-ui/core/styles";
import Item from "../Item/Item.lazy";
import Loading from "../Loading";
import NothingHere from "../NothingHere/NothingHere.lazy";
import {bindIds} from "../hooks";
import {collections} from "../../../config";
import {FirestoreQuery} from "@react-firebase/firestore/dist/types";
import {ItemInterface, ItemTypeInterface} from "../types";

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

export type ItemListProps = {
    path: string,
    where?: FirestoreQuery['where'],
    orderBy?: FirestoreQuery['orderBy'],
    unmarshal: (ids: string[], values: ItemInterface[]) => ItemInterface[], //TODO stricter type
    itemAction?: (item: ItemInterface) => JSX.Element,
}

const ItemList = ({path, where, orderBy, unmarshal, itemAction}: ItemListProps) => {
    const classes = useStyles();
    const typesPath = collections.types;

    return (
        <>
            <Container className={classes.container} maxWidth="md">
                <Grid container
                      alignItems="center"
                      justify="center"
                      spacing={2}
                      className={classes.container}>
                    <FirestoreCollection path={typesPath}>
                        {({isLoading, ids, value}) => {
                            const types = value ? bindIds<ItemTypeInterface>(true, ids, value) : {};
                            return isLoading ? (
                                <Loading/>
                            ) : (
                                <FirestoreCollection path={path} where={where} orderBy={orderBy} limit={25}>
                                    {({isLoading, ids, value}) => {
                                        return isLoading ? (
                                            <Loading/>
                                        ) : (
                                            (value === null || value.length === 0 || !value.some((item: ItemInterface) => item.active)) ?
                                                (
                                                    <NothingHere/>
                                                ) : (
                                                    unmarshal(ids, value).map((item) => (
                                                            item.active && <Item key={item.id} item={item} types={types} itemAction={itemAction}/>
                                                        )
                                                    ))
                                        )
                                    }}
                                </FirestoreCollection>
                            )
                        }}
                    </FirestoreCollection>
                </Grid>
            </Container>
        </>
    );
}

export default ItemList;
