import React from 'react';
import ItemList from "../../Common/ItemList/ItemList.lazy";
import {COLLECTIONS} from "../../../util/config";
import UserAction from "./UserAction/UserAction.lazy";
import {orderByCreated} from "../../../util/utils";
import {FirestoreQuery, FirestoreQueryWhere, ItemInterface} from "../../../util/types";
import {useUser} from "reactfire";

const UserItems = () => {
    const {data: user} = useUser();
    if (!user) return null;

    const path = COLLECTIONS.items;
    const orderBy = orderByCreated;
    const where: FirestoreQueryWhere = {
        fieldPath: 'uid',
        opStr: '==',
        value: user.uid,
    };
    const query: FirestoreQuery = {
        where: [where],
        orderBy,
    };

    return (
        <ItemList path={path} query={query}
                  itemAction={(item: ItemInterface) => (<UserAction id={item.id} path={path}/>)}/>
    )
};

export default UserItems;
