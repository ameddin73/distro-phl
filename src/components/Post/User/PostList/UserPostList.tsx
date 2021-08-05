import React from 'react';
import PostList from "common/Post/PostList/PostList";
import {COLLECTIONS} from "util/config";
import {FirestoreQuery, FirestoreQueryWhere} from "util/types.distro";
import {useUser} from "reactfire";
import {Query} from "util/utils";

const UserPostList = () => {
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
        orderBy: [Query.orderByAsc.created],
    };

    return (
        <PostList path={path} query={query}/>
    )
};

export default UserPostList;
