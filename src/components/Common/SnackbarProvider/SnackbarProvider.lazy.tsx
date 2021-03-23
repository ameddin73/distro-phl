import React, {lazy, Suspense} from 'react';

const LazySnackbarProvider = lazy(() => import('./SnackbarProvider'));

const SnackbarProvider = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
    <Suspense fallback={null}>
        <LazySnackbarProvider {...props} />
    </Suspense>
);

export default SnackbarProvider;
