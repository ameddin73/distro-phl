import React from 'react';
import {PATHS} from "util/config";
import Login from "./Login/Login";
import UserPostList from "../Post/User/PostList/UserPostList";
import {Route, useRouteMatch} from "react-router-dom";
import PrivateRoute from "common/PrivateRoute";
import NewPost from "../Post/User/NewPost/NewPost";
import Chats from "./Chats/Chats";

const User = () => {
    const match = useRouteMatch();

    return (
        <>
            <Route path={`${match.path}${PATHS.user.login}`}>
                <Login/>
            </Route>
            <PrivateRoute exact path={`${match.path}${PATHS.user.chats}`}>
                <Chats/>
            </PrivateRoute>
            <PrivateRoute exact path={`${match.path}${PATHS.user.chats}/:id`}>
                <Chats/>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}${PATHS.user.posts}`}>
                <UserPostList/>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}${PATHS.user.newPost}`}>
                <NewPost/>
            </PrivateRoute>
        </>
    )
};

export default User;
