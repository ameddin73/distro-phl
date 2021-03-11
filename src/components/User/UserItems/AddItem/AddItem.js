import React, {useState} from 'react';
import {itemStyle} from "../../../Common/styles";
import {Card, CardContent, CardMedia, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import {collections, descriptionLength} from "../../../../config";
import {bindIds, useInput} from "../../../Common/hooks";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import {FirestoreCollection} from "@react-firebase/firestore";
import {Loading} from "../../../Common/Loading";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(2),
    },
    mediaBox: {
        background: grey[500],
        padding: theme.spacing(1),
    },
    upload: {
        color: grey[200],
        fontSize: 100,
    },
    title: {
        fontSize: theme.typography.h6.fontSize,
    },
    selector: {
        width: '100%',
    },
    body: {
        fontSize: theme.typography.body2.fontSize,
    }
}));

// const AddItem = ({user}) => { ,,TODO add user
const AddItem = () => {
    const itemClasses = itemStyle();
    const classes = useStyles();
    const dLength = descriptionLength;

    const path = collections.types;
    const orderBy = [{field: 'index', type: 'asc'}];

    const [imgFile, setImgFile] = useState(null);
    const [uploadRef, setUploadRef] = useState(null);
    const {/*value: title, TODO submit title */ bind: bindTitle} = useInput('');
    const {value: description, bind: bindDescription} = useInput('');
    const {/*value: type, TODO submit type */bind: bindType} = useInput('');

    const changeFile = (event) => {
        setImgFile(URL.createObjectURL(event.target.files[0]));
    }

    const unmarshal = bindIds;

    return (
        <>
            <FirestoreCollection path={path} orderBy={orderBy}>
                {({isLoading, ...rest}) => {
                    return isLoading ? (
                        <Loading/>
                    ) : (
                        <>
                            <input hidden id="imageInput" type="file" accept="image/*"
                                   onChange={changeFile}
                                   ref={(ref) => setUploadRef(ref)}/>
                            <Grid container
                                  direction="column"
                                  alignItems="center"
                                  className={classes.container}>
                                <Grid item xs>
                                    <Typography variant="h5" color="primary" justify="center" gutterBottom>
                                        Post a new item.
                                    </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Card className={itemClasses.card}>
                                        {imgFile ?
                                            <CardMedia
                                                className={itemClasses.media}
                                                image={imgFile}
                                                title="Uploaded Item Image"/>
                                            :
                                            <Grid container
                                                  alignItems="center"
                                                  direction="column"
                                                  className={`${classes.mediaBox} ${itemClasses.media}`}>
                                                <IconButton onClick={() => uploadRef.click()}>
                                                    <CameraAlt className={classes.upload}/>
                                                </IconButton>
                                            </Grid>
                                        }
                                        <CardContent>
                                            <TextField {...bindTitle}
                                                       inputProps={{className: classes.title}}
                                                       margin="dense"
                                                       fullWidth
                                                       required
                                                       id="title"
                                                       placeholder="Title"
                                                       variant="outlined"
                                            />
                                            <FormControl className={classes.selector}>
                                                <InputLabel id="select-item-type-label">Type</InputLabel>
                                                <Select {...bindType}
                                                        labelId="select-item-type-label"
                                                        id="select-item-type"
                                                        fullWidth
                                                >
                                                    {unmarshal(rest).map((type) => {
                                                        return (
                                                            <MenuItem key={type.id} value={type.id}>{type.displayName}</MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                            <TextField {...bindDescription}
                                                       inputProps={{
                                                           className: classes.body,
                                                           maxLength: dLength,
                                                       }}
                                                       margin="dense"
                                                       fullWidth
                                                       required
                                                       multiline
                                                       id="description"
                                                       placeholder="Description"
                                                       variant="outlined"
                                                       label={"Characters remaining: " + (dLength - description.length)}
                                            />
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker/>
                                            </MuiPickersUtilsProvider>
                                            <Grid container direction="column">
                                                <Grid item xs>
                                                    <Typography variant="body2">
                                                        Supplied by:
                                                    </Typography>
                                                    <Typography variant="button">
                                                        {/*{user.uid}*/}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    )
                }}
            </FirestoreCollection>
        </>
    )
};

export default AddItem;
