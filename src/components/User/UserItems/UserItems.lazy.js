import React, { lazy, Suspense } from 'react';

const LazyUserItems = lazy(() => import('./UserItems'));

const UserItems = props => (
  <Suspense fallback={null}>
    <LazyUserItems {...props} />
  </Suspense>
);

export default UserItems;
