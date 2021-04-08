import React from 'react';
import {COLLECTIONS} from "util/config";
import {FirestoreQuery, ItemInterface} from "util/types";
import {AuthCheck, useUser} from "reactfire";
import ErrorMessage from "../Common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";
import {Query} from "util/utils";
import PostList from "../Common/PostList/PostList.lazy";

const path = COLLECTIONS.posts;
const orderBy = Query.orderByCreated;
const query: FirestoreQuery = {
    where: [Query.whereActive, Query.whereNoExpiration],
    orderBy,
};

const PublicHub = () => (
    <PostList path={path}
              query={query}
              postAction={() => (<></>)}/>
);

const UserHub = () => {
    const {data: user} = useUser();
    if (!user) return null;

    const filter = ((post: ItemInterface) => post.uid !== user.uid);

    return (
        <PostList path={path}
                  query={query}
                  filter={filter}
                  postAction={() => (<></>)}/>
    );
};

const DistroHub = () => (
    <ErrorBoundary FallbackComponent={ErrorMessage}>
        <AuthCheck fallback={<PublicHub/>}>
            <UserHub/>
        </AuthCheck>
    </ErrorBoundary>
);

export default DistroHub;
