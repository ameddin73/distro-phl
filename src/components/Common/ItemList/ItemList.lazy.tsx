import React, {lazy, Suspense} from 'react';
import {ItemListProps} from "./ItemList";
import Loading from "../Loading";

const LazyItemList = lazy(() => import('./ItemList'));

const ItemList = (props: ItemListProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyItemList {...props} />
    </Suspense>
);

export default ItemList;
