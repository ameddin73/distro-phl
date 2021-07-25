import React from 'react';
import PostList from "../../Common/Post/PostList/PostList";
import {COLLECTIONS} from "util/config";
import {FirestoreQuery, FirestoreQueryWhere} from "util/types.distro";
import {useUser} from "reactfire";
import {PostQuery} from "util/utils";

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
        <PostList path={path} query={query}/>
    )
};

export default UserPosts;
