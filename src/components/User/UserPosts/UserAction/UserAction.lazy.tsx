import React, {lazy, Suspense} from 'react';
import Loading from "../../../Common/Loading";
import {ItemInterface} from "util/types";

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = (props: ItemInterface) => (
    <Suspense fallback={<Loading/>}>
        <LazyUserAction {...props} />
    </Suspense>
);

export default UserAction;
