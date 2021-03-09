import React from 'react';
import {Grid, IconButton, Input, InputAdornment, makeStyles} from "@material-ui/core";
import {Add, ArrowLeft, ArrowRight} from "@material-ui/icons";
import {FirestoreMutation} from "@react-firebase/firestore";
import {useInput} from "../../Common/hooks";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    buttons: {
        padding: theme.spacing(0),
        maxHeight: 26,
    },
    input: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
        },
    },
}));


const HubAction = ({id, count, path}) => {
    const classes = useStyles();

    const {value: select, bind: bindSelect, setValue: setSelect} = useInput(0);

    const updateSelect = (increment) => {
        if (increment) {
            setSelect(select + 1 > count ? count : select + 1);
        } else {
            setSelect(select - 1 < 0 ? 0 : select - 1);
        }
    }

    //TODO create reservation
    const submit = (runMutation) => {
        // if (select > 0) {
        //     runMutation({
        //     }).catch(error => {
        //         console.log(error);
        //     })
        // }
    }

    return (
        <div>
            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <Grid container alignItems="center">
                        <Grid item xs={3}>
                            <IconButton onClick={() => updateSelect(false)}>
                                <ArrowLeft/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <Input {...bindSelect}
                                   id={"selectAmount-" + id}
                                   type="number"
                                   className={classes.input}
                                   disableUnderline
                                   margin="dense"
                                   fullWidth
                                   inputProps={{min: 0, max: count}}
                                   endAdornment={<InputAdornment position="end">/{count}</InputAdornment>}
                                   size="small"
                                   color="primary"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Grid item xs>
                                <IconButton onClick={() => updateSelect(true)}>
                                    <ArrowRight/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <Grid container justify="flex-end">
                        <FirestoreMutation type={'update'} path={path + '/' + id}>
                            {({runMutation}) => {
                                return (
                                    <IconButton onClick={() => submit(runMutation)} color="primary" aria-label="add">
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
