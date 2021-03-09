import React, { lazy, Suspense } from 'react';

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = props => (
  <Suspense fallback={null}>
    <LazyUserAction {...props} />
  </Suspense>
);

export default UserAction;
