import React from 'react';
import ItemList from "../Common/ItemList/ItemList";

const DistroHub = () => {
    const path = process.env.REACT_APP_DISTRO_HUB_COLLECTION;
    const orderBy = [{field: 'created', type: 'asc'}]

    // Assign ids to value objects and reduce on user+name
    //TODO subtract reservations
    const unmarshall = ({ids, value}) => {
        value.forEach((item, index) => {
            item.id = ids[index]
            item.count = item.count - item.reserved;
        });
        return value;
    };

    return (
        <div>
            <ItemList path={path} orderBy={orderBy} unmarshall={unmarshall}/>
        </div>
    );
}

export default DistroHub;
