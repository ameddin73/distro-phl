import React, {lazy, Suspense} from 'react';
import Loading from "../../../Common/Loading";
import {ItemActionProps} from "util/types";

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = (props: ItemActionProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyUserAction {...props} />
    </Suspense>
);

export default UserAction;
