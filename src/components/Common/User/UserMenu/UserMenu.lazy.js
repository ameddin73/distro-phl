import React, { lazy, Suspense } from 'react';

const LazyUserMenu = lazy(() => import('./UserMenu'));

const UserMenu = props => (
  <Suspense fallback={null}>
    <LazyUserMenu {...props} />
  </Suspense>
);

export default UserMenu;
