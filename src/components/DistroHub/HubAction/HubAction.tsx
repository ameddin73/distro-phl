import React from 'react';
import {Grid, IconButton} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {FirestoreMutation} from "@react-firebase/firestore";

export type ItemActionProps = {
    id: string,
    path: string,
}

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
                        <FirestoreMutation type={'update'} path={path + '/' + id}>
                            {() => {
                                return (
                                    <IconButton color="primary" aria-label="add">
                                        <Add/>
                                    </IconButton>
                                )
                            }}
                        </FirestoreMutation>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default HubAction;
