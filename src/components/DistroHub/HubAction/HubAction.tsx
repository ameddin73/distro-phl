import React from 'react';
import {Grid, IconButton} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {ItemActionProps} from "../../../util/types";

const HubAction = ({id, path}: ItemActionProps) => {

    //TODO create reservation
    // const submit = (runMutation) => {
    // if (select > 0) {
    //     runMutation({
    //     }).catch(error => {
    //         console.log(error);
    //     })
    // }
    // }

    return (
        <div>
            <Grid container alignItems="center">
                <Grid item xs={6}>
                </Grid>
                <Grid item xs>
                    <Grid container justify="flex-end">
                        <IconButton color="primary" aria-label="add">
                            <Add/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default HubAction;
