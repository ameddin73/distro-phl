import React, { lazy, Suspense } from 'react';

const LazyAddItem = lazy(() => import('./AddItem'));

const AddItem = props => (
  <Suspense fallback={null}>
    <LazyAddItem {...props} />
  </Suspense>
);

export default AddItem;
