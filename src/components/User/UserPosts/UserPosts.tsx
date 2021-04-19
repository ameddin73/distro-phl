import React from 'react';
import PostList from "../../Common/Post/PostList/PostList";
import {COLLECTIONS} from "util/config";
import UserAction from "./UserAction/UserAction";
import {FirestoreQuery, FirestoreQueryWhere} from "util/types";
import {useUser} from "reactfire";
import {PostQuery} from "util/utils";
import {PostProps} from "../../Common/Post/PostCard/PostCard";

const UserPosts = () => {
    const {data: user} = useUser();
    if (!user) return null;

    const path = COLLECTIONS.posts;
    const where: FirestoreQueryWhere = {
        fieldPath: 'uid',
        opStr: '==',
        value: user.uid,
    };
    const query: FirestoreQuery = {
        where: [PostQuery.where.active, where],
        orderBy: [PostQuery.orderBy.created],
    };

    return (
        <PostList path={path} query={query}
                  postAction={(post: PostProps) => (<UserAction {...post}/>)}/>
    )
};

export default UserPosts;
