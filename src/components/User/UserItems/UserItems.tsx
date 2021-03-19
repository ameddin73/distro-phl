import React from 'react';
import ItemList from "../../Common/ItemList/ItemList.lazy";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
// @ts-ignore
import {navigate} from 'hookrouter';
import {collections, paths} from "../../../util/config";
import UserAction from "./UserAction/UserAction.lazy";
import Loading from "../../Common/Loading";
import {ItemInterface} from "../../../util/types";
import {FirestoreQuery} from "@react-firebase/firestore/dist/types";
import {bindIds} from "../../../util/utils";

const UserItems = () => {
    const path = collections.items;
    const orderBy: FirestoreQuery['orderBy'] = [{field: 'created', type: 'asc'}];

    const unmarshal = (ids: string[], values: ItemInterface[]) => {
        values = bindIds<ItemInterface>(false, ids, values);
        return values;
    };

    return (
        <div>
            <FirebaseAuthConsumer>
                {({isSignedIn, user, providerId}) => {
                    if (providerId === null) {
                        return (<Loading/>)
                    } else if (!isSignedIn) {
                        navigate(paths.public.login, true, {redirect: paths.public.userItems});
                    } else {
                        const where: FirestoreQuery['where'] = {field: 'uid', operator: '==', value: user.uid}
                        return (
                            <ItemList path={path} where={where} orderBy={orderBy}
                                // @ts-ignore
                                      itemAction={({id}) => (<UserAction id={id}/>)}
                                      unmarshal={unmarshal}/>
                        );
                    }
                }}
            </FirebaseAuthConsumer>
        </div>
    )
};

export default UserItems;
