import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Item from "../Item/Item.lazy";
import NothingHere from "../NothingHere/NothingHere.lazy";
import {FirestoreQuery, ItemInterface} from "../../../util/types";
import {itemConverter} from "../../../util/utils";
import {useFirestoreCollectionBuilder, useItemTypes} from "../../../util/hooks";

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
    itemAction?: (item: ItemInterface) => JSX.Element,
    filter?: (item: ItemInterface) => boolean,
}

const IList = ({props: {path, query, filter, itemAction}}: { props: ItemListProps }) => {
    const types = useItemTypes();
    const {data: items} = useFirestoreCollectionBuilder(path, query, itemConverter);

    if (!items || items.length === 0) {
        return (<NothingHere/>);
    } else {

        const itemList = filter ? items.filter(filter) : items;
        return (<>
            {itemList.map((item => (<Item key={item.id} item={item} types={types} itemAction={itemAction}/>)))}
        </>)
    }
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
                <IList props={props}/>
            </Grid>
        </Container>
    );
}

export default ItemList;
