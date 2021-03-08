import React from 'react';
import {Typography} from "@material-ui/core";

const HubAction = ({item: {count}}) => {
    return (
        <div>
            <Typography variant="body2">
                Count: {count}
            </Typography>
        </div>
    )
};

export default HubAction;
