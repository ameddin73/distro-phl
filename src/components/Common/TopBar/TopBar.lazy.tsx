import React, {lazy, Suspense} from 'react';
import Loading from "../Loading";

const LazyCommon = lazy(() => import('./TopBar'));

const Common = () => (
    <Suspense fallback={<Loading/>}>
        <LazyCommon/>
    </Suspense>
);

export default Common;
