import React from 'react';
import {PATHS} from "util/config";
import Login from "./Login/Login";
import UserPosts from "./UserPosts/UserPosts";
import {Route, useRouteMatch} from "react-router-dom";
import PrivateRoute from "../Common/PrivateRoute";
import NewPost from "./UserPosts/NewPost/NewPost";

const User = () => {
    const match = useRouteMatch();

    return (
        <>
            <Route path={`${match.path}${PATHS.user.login}`}>
                <Login/>
            </Route>
            <PrivateRoute path={`${match.path}${PATHS.user.posts}`}>
                <UserPosts/>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}${PATHS.user.new}`}>
                <NewPost/>
            </PrivateRoute>
        </>
    )
};

export default User;
