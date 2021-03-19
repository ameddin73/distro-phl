import React, {lazy, Suspense} from 'react';
import {UserActionProps} from "./UserAction";
import Loading from "../../../Common/Loading";

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = (props: UserActionProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyUserAction {...props} />
    </Suspense>
);

export default UserAction;
