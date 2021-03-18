import React, {lazy, Suspense} from 'react';
import {AddItemProps} from "./AddItem";

const LazyAddItem = lazy(() => import('./AddItem'));

const AddItem = (props: AddItemProps) => (
    <Suspense fallback={null}>
        <LazyAddItem {...props} />
    </Suspense>
);

export default AddItem;
