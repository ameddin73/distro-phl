import React, {lazy, Suspense} from 'react';

const LazyUserMenu = lazy(() => import('./UserMenu'));

const UserMenu = () => (
    <Suspense fallback={null}>
        <LazyUserMenu/>
    </Suspense>
);

export default UserMenu;
