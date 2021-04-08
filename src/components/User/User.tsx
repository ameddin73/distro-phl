import React from 'react';
import {PATHS} from "util/config";
import Login from "./Login/Login.lazy";
import UserPosts from "./UserPosts/UserPosts.lazy";
import AddItem from "./UserPosts/NewPost/AddItem.lazy";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import PrivateRoute from "../Common/PrivateRoute";

const User = () => {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}${PATHS.user.login}`}>
                <Login/>
            </Route>
            <PrivateRoute path={`${match.path}${PATHS.user.posts}`}>
                <UserPosts/>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}${PATHS.user.create}`}>
                <AddItem/>
            </PrivateRoute>
        </Switch>
    )
};

export default User;
