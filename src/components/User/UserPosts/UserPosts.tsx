import React from 'react';
import PostList from "../../Common/PostList/PostList";
import {COLLECTIONS} from "util/config";
import UserAction from "./UserAction/UserAction";
import {FirestoreQuery, FirestoreQueryWhere} from "util/types";
import {useUser} from "reactfire";
import {Query} from "util/utils";
import {PostProps} from "../../Common/Post/Post";

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
        where: [Query.where.active, where],
        orderBy: [Query.orderBy.created],
    };

    return (
        <PostList path={path} query={query}
                  postAction={(post: PostProps) => (<UserAction {...post}/>)}/>
    )
};

export default UserPosts;
