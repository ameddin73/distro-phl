import React from 'react';
import ItemList from "../../Common/ItemList/ItemList.lazy";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {navigate} from 'hookrouter';
import {paths} from "../../Common/config";

const UserItems = () => {
    const path = process.env.REACT_APP_DISTRO_HUB_COLLECTION;
    const orderBy = [{field: 'created', type: 'asc'}]

    const unmarshal = ({ids, value}) => {
        value.forEach((item, index) => {
            item.id = ids[index]
            item.count = item.count - item.reserved;
        });
        return value;
    };

    return (
        <div>
            <FirebaseAuthConsumer>
                {({isSignedIn, user}) => {
                    if (isSignedIn !== true) {
                        navigate(paths.login, true, {redirect: paths.userItems});
                    } else {
                        const where = {field: 'uid', operator: '==', value: user.uid}
                        return (
                            <ItemList path={path} where={where} orderBy={orderBy} unmarshal={unmarshal}/>
                        );
                    }
                }}
            </FirebaseAuthConsumer>
        </div>
    )
};

export default UserItems;
