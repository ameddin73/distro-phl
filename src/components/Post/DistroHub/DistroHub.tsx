import React from 'react';
import {COLLECTIONS} from "util/config";
import {FirestoreQuery, Post} from "util/types.distro";
import {AuthCheck, useUser} from "reactfire";
import ErrorMessage from "common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";
import {Filters, Query} from "util/utils";
import PostList from "common/Post/PostList/PostList";

const path = COLLECTIONS.posts;
const query: FirestoreQuery = {
    where: [Query.where.active, Query.includeField.created],
    orderBy: [Query.orderByAsc.created],
};


const PublicHub = () => (
    <PostList path={path}
              query={query}
              filter={Filters.unexpired}
              postAction={() => (<></>)}/>
);

const UserHub = () => {
    const {data: user} = useUser();
    if (!user) return null;

    const filter = ((post: Post) => (post.uid !== user.uid && Filters.unexpired(post)));

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
