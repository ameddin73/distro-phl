import React from 'react';
import ItemList from "../Common/ItemList/ItemList";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import HubAction from "./HubAction/HubAction";

const DistroHub = () => {
    const path = process.env.REACT_APP_DISTRO_HUB_COLLECTION;
    const orderBy = [{field: 'created', type: 'asc'}]

    // Assign ids to value objects and reduce on user+name
    //TODO subtract reservations
    const unmarshal = (uid) => (
        ({ids, value}) => {
            value.forEach((item, index) => {
                item.id = ids[index]
                item.count = item.count - item.reserved;
                if (item.uid === uid) value.splice(index, 1);
            });
            return value;
        })

    return (
        <div>
            <FirebaseAuthConsumer>
                {({isSignedIn, user}) => {
                    return (
                        <ItemList path={path}
                                  orderBy={orderBy}
                                  itemAction={(item) => (<HubAction item={item}/>)}
                                  unmarshal={unmarshal(isSignedIn ? user.uid : null)}/>
                    )
                }}
            </FirebaseAuthConsumer>
        </div>
    );
}

export default DistroHub;
