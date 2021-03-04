import React, {useState} from 'react';
import {List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography} from "@material-ui/core";
import {FirestoreCollection} from "@react-firebase/firestore";
import {Fastfood} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const DistroHub = ({user}) => {
    const classes = useStyles();
    const [open, setOpen] = useState();

    const handleClick = (entry) => (setOpen(open[entry] = open.hasOwnProperty(entry) ? !open[entry] : true));

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Welcome to the Distro Hub, {user.displayName}!
            </Typography>
            <FirestoreCollection path="/distro_hub/" limit={1}>
                {({isLoading, value}) => {
                    return isLoading ? "Loading" : (
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Available from the Hub
                                </ListSubheader>
                            }
                            classname={classes.root}>
                            {value.map((entry) => (
                                <ListItem button>
                                    <ListItemIcon>
                                        <Fastfood/>
                                    </ListItemIcon>
                                    <ListItemText primary={entry.name}/>
                                </ListItem>
                            ))}
                        </List>
                    )
                }}
            </FirestoreCollection>
        </div>
    );
}

export default DistroHub;
