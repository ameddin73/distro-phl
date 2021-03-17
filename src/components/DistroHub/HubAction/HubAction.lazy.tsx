import React, {lazy, Suspense} from 'react';
import {ItemActionProps} from "./HubAction";

const LazyHubAction = lazy(() => import('./HubAction'));

const HubAction = (props: ItemActionProps) => (
    <Suspense fallback={null}>
        <LazyHubAction {...props} />
    </Suspense>
);

export default HubAction;
