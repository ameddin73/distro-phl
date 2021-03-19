import React, {lazy, Suspense} from 'react';
import {ItemActionProps} from "./HubAction";
import Loading from "../../Common/Loading";

const LazyHubAction = lazy(() => import('./HubAction'));

const HubAction = (props: ItemActionProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyHubAction {...props} />
    </Suspense>
);

export default HubAction;
