import React, {lazy, Suspense} from 'react';
import {ItemProps} from "./Item";
import Loading from "../Loading";

const LazyDistroItem = lazy(() => import('./Item'));

const DistroItem = (props: ItemProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyDistroItem {...props} />
    </Suspense>
);

export default DistroItem;
