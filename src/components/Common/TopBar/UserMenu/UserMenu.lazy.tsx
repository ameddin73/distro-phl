import React, {lazy, Suspense} from 'react';
import Loading from "../../Loading";

const LazyUserMenu = lazy(() => import('./UserMenu'));

const UserMenu = () => (
    <Suspense fallback={<Loading/>}>
        <LazyUserMenu/>
    </Suspense>
);

export default UserMenu;
