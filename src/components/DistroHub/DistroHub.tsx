import React from 'react';
import {COLLECTIONS} from "util/config";
import {FirestoreQuery, PostInterface} from "util/types.distro";
import {AuthCheck, useUser} from "reactfire";
import ErrorMessage from "../Common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";
import {Filters, PostQuery} from "util/utils";
import PostList from "../Common/Post/PostList/PostList";

const path = COLLECTIONS.posts;
const query: FirestoreQuery = {
    where: [PostQuery.where.active, PostQuery.includeField.created],
    orderBy: [PostQuery.orderBy.created],
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

    const filter = ((post: PostInterface) => (post.uid !== user.uid && Filters.unexpired(post)));

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
