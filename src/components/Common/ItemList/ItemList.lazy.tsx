import React, {lazy, Suspense} from 'react';
import {ItemListProps} from "./ItemList";

const LazyItemList = lazy(() => import('./ItemList'));

const ItemList = (props: ItemListProps) => (
    <Suspense fallback={null}>
        <LazyItemList {...props} />
    </Suspense>
);

export default ItemList;
