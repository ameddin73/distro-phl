import React, {lazy, Suspense} from 'react';
import {UserActionProps} from "./UserAction";

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = (props: UserActionProps) => (
    <Suspense fallback={null}>
        <LazyUserAction {...props} />
    </Suspense>
);

export default UserAction;
