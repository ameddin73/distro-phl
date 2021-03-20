import React, {SyntheticEvent, useState} from 'react';
import {itemStyle} from "../../../../util/styles";
import {Button, Card, CardContent, CardMedia, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import {COLLECTIONS, DEFAULT_IMAGE, DESCRIPTION_LENGTH, PATHS, STORAGE} from "../../../../util/config";
import {useFirestoreAdd, useInput, useItemTypes} from "../../../../util/hooks";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import theme from "../../../../util/theme";
import firebase from "firebase/app";
import 'firebase/storage';
// @ts-ignore
import {navigate} from 'hookrouter';
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {getFileWithUUID, itemConverter} from "../../../../util/utils";
import {useStorage, useUser} from "reactfire";

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
    input: {
        width: '100%',
    },
    body: {
        fontSize: theme.typography.body2.fontSize,
    }
}));

interface HTMLInputEvent extends SyntheticEvent {
    target: HTMLInputElement & EventTarget,
}

const AddItem = () => {
    const itemClasses = itemStyle();
    const classes = useStyles();
    const path = COLLECTIONS.items;

    const storage = useStorage();
    const {data: user} = useUser();
    const types = useItemTypes();
    const [addItem] = useFirestoreAdd(path, itemConverter);

    const [error, setError] = useState<string | null>(null);
    const [imgLocalImgUrl, setLocalImgUrl] = useState<string>();
    const [imgFile, setImgFile] = useState<File>();
    const [storageRef, setStorageRef] = useState<firebase.storage.Reference>();
    const [uploadRef, setUploadRef] = useState<HTMLInputElement | null>(null);
    const [expires, setExpires] = useState<Date>();
    const {value: title, bind: bindTitle} = useInput('');
    const {value: description, bind: bindDescription} = useInput('');
    const {value: type, bind: bindType} = useInput('');

    const changeFile = (event: HTMLInputEvent) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setLocalImgUrl(URL.createObjectURL(file));
            setImgFile(getFileWithUUID(file));
            setStorageRef(storage.ref().child(STORAGE.itemImage + file.name));
        } else {
            console.error('event.target.files[0] may be null');
            setError('Something went wrong attaching image.');
        }
    }
    const changeExpires = (date: MaterialUiPickersDate) => setExpires(date as Date);
    const uploadImg = () => {
        if (imgFile && storageRef) return storageRef.put(imgFile);
        setError('Something went wrong uploading image.');
        throw 'Error uploading image. Image file or storage reference was not defined.';
    }
    const submit = (event: SyntheticEvent) => {
        event.preventDefault();
        uploadImg().then(() =>
            addItem({
                active: true,
                created: new Date(),
                description: description,
                displayName: title,
                ...(types[type].expires && {expires: expires}),
                id: '',
                image: storageRef?.fullPath ? storageRef.fullPath : DEFAULT_IMAGE,
                type: type,
                userName: user.displayName ? user.displayName : '',
                uid: user.uid,
            })).catch((error: Error) => {
            console.error(error);
            setError('Something went wrong posting item.');
            if (storageRef) storageRef.delete().then(() => console.warn('Image deleted successfully.'))
                .catch((error) => {
                    console.error(error);
                    console.error('Delete failed for: ' + storageRef.fullPath + '. File may be orphaned.');
                });
        });
        navigate(PATHS.public.userItems, {addSuccess: true});
    };

    return (
        <>
            <Grid container
                  direction="column"
                  alignItems="center"
                  className={classes.container}>
                <Grid item xs>
                    <Typography variant="h5" color="primary" align="center" gutterBottom>
                        Post a new item.
                    </Typography>
                </Grid>
                {error && (
                    <Grid item xs>
                        <Typography variant="h5" color="primary" align="center" gutterBottom>
                            {error}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs>
                    <Card className={itemClasses.card}>
                        <form onSubmit={submit}>
                            {imgLocalImgUrl ?
                                <CardMedia
                                    className={itemClasses.media}
                                    image={imgLocalImgUrl}
                                    title="Uploaded Item Image"/>
                                :
                                <Grid container
                                      alignItems="center"
                                      direction="column"
                                      className={`${classes.mediaBox} ${itemClasses.media}`}>
                                    <IconButton onClick={() => {
                                        if (uploadRef) uploadRef.click();
                                    }}>
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
                                           placeholder="Item Name"
                                           label="Name"
                                />
                                <FormControl className={classes.input}>
                                    <InputLabel id="select-item-type-label">Type</InputLabel>
                                    <Select {...bindType}
                                            labelId="select-item-type-label"
                                            id="select-item-type"
                                            fullWidth
                                            required
                                    >
                                        {Object.keys(types).map((type) => {
                                            return (
                                                <MenuItem key={type} value={type}>{types[type].displayName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                {types[type] && types[type].expires && (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker value={expires}
                                                            onChange={changeExpires}
                                                            className={classes.input}
                                                            disableToolbar
                                                            format="MM/dd/yyyy"
                                                            margin="dense"
                                                            id="expiration-date-picker"
                                                            label="Expiration Date"
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change expires',
                                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                )}
                                <TextField {...bindDescription}
                                           className={classes.input}
                                           inputProps={{
                                               className: classes.body,
                                               maxLength: DESCRIPTION_LENGTH,
                                           }}
                                           fullWidth
                                           required
                                           multiline
                                           margin="dense"
                                           id="description"
                                           placeholder="Description"
                                           label="Description"
                                           helperText={description.length > 0 ? "Characters remaining: " + (DESCRIPTION_LENGTH - description.length) : ""}
                                />
                                <Grid container direction="column">
                                    <Grid item xs style={{display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="body2" noWrap style={{paddingRight: theme.spacing(1)}}>
                                            Supplied by:
                                        </Typography>
                                        <Typography variant="button" noWrap>
                                            {user.displayName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Button type="submit"
                                    variant="contained"
                                    disableElevation
                                    color="primary"
                                    className={classes.input}
                                    style={{padding: theme.spacing(1.5)}}>
                                Submit
                            </Button>
                        </form>
                    </Card>
                </Grid>
            </Grid>
            <input hidden id="imageInput" type="file" accept="image/*"
                   onChange={changeFile}
                   ref={(ref) => setUploadRef(ref)}/>
        </>
    )
};

export default AddItem;