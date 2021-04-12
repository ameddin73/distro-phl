import React from 'react';
import {COLLECTIONS} from "util/config";
import {FirestoreQuery} from "util/types";
import {AuthCheck, useUser} from "reactfire";
import ErrorMessage from "../Common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";
import {Filters, Query} from "util/utils";
import PostList from "../Common/PostList/PostList";
import {PostInterface} from "../Common/Post/types";

const path = COLLECTIONS.posts;
const query: FirestoreQuery = {
    where: [Query.where.active, Query.includeField.created],
    orderBy: [Query.orderBy.created],
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
