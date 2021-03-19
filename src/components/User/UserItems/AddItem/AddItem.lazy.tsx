import React, {lazy, Suspense} from 'react';
import {AddItemProps} from "./AddItem";
import Loading from "../../../Common/Loading";

const LazyAddItem = lazy(() => import('./AddItem'));

const AddItem = (props: AddItemProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyAddItem {...props} />
    </Suspense>
);

export default AddItem;
