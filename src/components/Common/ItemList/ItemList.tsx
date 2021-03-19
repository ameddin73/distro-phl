import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Item from "../Item/Item.lazy";
import Loading from "../Loading";
import NothingHere from "../NothingHere/NothingHere.lazy";
import {FirestoreQuery, ItemInterface} from "../../../util/types";
import {SuspenseWithPerf} from 'reactfire';
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
}

const Data = ({props: {path, query, itemAction}}: { props: ItemListProps }) => {
    const [getItems] = useFirestoreCollectionBuilder(path, query, itemConverter);
    const types = useItemTypes();
    const {data: items} = getItems();

    if (!items || items.length === 0) {
        return (<NothingHere/>);
    } else {
        return (<>
            {items.forEach((item => (<Item key={item.id} item={item} types={types} itemAction={itemAction}/>)))}
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
                <SuspenseWithPerf fallback={Loading} traceId="load-items">
                    <Data props={props}/>
                </SuspenseWithPerf>
            </Grid>
        </Container>
    );
}

export default ItemList;
