import React, {lazy, Suspense} from 'react';
import {ItemProps} from "./Item";
import Loading from "../Loading";

const LazyItem = lazy(() => import('./Item'));

const DistroItem = (props: ItemProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyItem {...props} />
    </Suspense>
);

export default DistroItem;
