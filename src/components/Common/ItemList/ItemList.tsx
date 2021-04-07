import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Item from "../Item/Item.lazy";
import NothingHere from "../NothingHere/NothingHere.lazy";
import {FirestoreQuery, ItemInterface} from "util/types";
import {Converters} from "util/utils";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";

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
    query?: FirestoreQuery,
    filter?: (item: ItemInterface) => boolean,
    itemAction?: (item: ItemInterface) => JSX.Element,
}

const IList = ({path, query, filter, itemAction}: ItemListProps) => {
    const {data} = useFirestoreCollectionBuilder(path, query, Converters.itemConverter);
    const items = data as ItemInterface[];

    if (!items || items.length === 0)
        return (<NothingHere/>);

    const itemList: ItemInterface[] = filter ? items.filter(filter) : items;

    if (itemList.length === 0)
        return (<NothingHere/>);
    return (<>
        {itemList.map(((item: ItemInterface) => (<Item key={item.id} item={item} itemAction={itemAction}/>)))}
    </>)
}

const ItemList = (props: ItemListProps) => {
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="md">
            <Grid container
                  alignItems="center"
                  justify="center"
                  spacing={2}
                  className={classes.container}>
                <IList {...props}/>
            </Grid>
        </Container>
    );
}

export default ItemList;
