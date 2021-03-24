import React, {lazy, Suspense} from 'react';
import Loading from "../../Common/Loading";
import {ItemActionProps} from "util/types";

const LazyHubAction = lazy(() => import('./HubAction'));

const HubAction = (props: ItemActionProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyHubAction {...props} />
    </Suspense>
);

export default HubAction;
