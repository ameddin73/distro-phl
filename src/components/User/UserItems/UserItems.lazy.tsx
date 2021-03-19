import React, {lazy, Suspense} from 'react';
import Loading from "../../Common/Loading";

const LazyUserItems = lazy(() => import('./UserItems'));

const UserItems = () => (
    <Suspense fallback={<Loading/>}>
        <LazyUserItems/>
    </Suspense>
);

export default UserItems;
