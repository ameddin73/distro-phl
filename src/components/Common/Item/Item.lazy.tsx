import React, {lazy, Suspense} from 'react';
import {ItemProps} from "./Item";

const LazyDistroItem = lazy(() => import('./Item'));

const DistroItem = (props: ItemProps) => (
    <Suspense fallback={null}>
        <LazyDistroItem {...props} />
    </Suspense>
);

export default DistroItem;
