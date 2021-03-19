import React, {SyntheticEvent, useState} from 'react';
import {itemStyle} from "../../../Common/styles";
import {Button, Card, CardContent, CardMedia, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import * as config from "../../../../config";
import {collections, descriptionLength, paths, storage} from "../../../../config";
import {bindIds, getFileWithUUID, useInput} from "../../../Common/hooks";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import {FirestoreCollection, FirestoreMutation} from "@react-firebase/firestore";
import Loading from "../../../Common/Loading";
import theme from "../../../../theme";
import firebase from "firebase/app";
import 'firebase/storage';
// @ts-ignore
import {navigate} from 'hookrouter';
import {ItemMutation, ItemTypes} from "../../../../types";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {FirestoreQuery} from "@react-firebase/firestore/dist/types";

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

type ItemFormProps = {
    runMutation: ItemMutation,
    types: ItemTypes,
    user: firebase.User,
}

interface HTMLInputEvent extends SyntheticEvent {
    target: HTMLInputElement & EventTarget,
}

const ItemForm = ({runMutation, types, user}: ItemFormProps) => {
    const itemClasses = itemStyle();
    const classes = useStyles();
    const dLength = descriptionLength;

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
            setStorageRef(firebase.storage().ref().child(storage.itemImage + file.name));
        } else {
            console.error('event.target.files[0] may be null');
            setError('Something went wrong attaching image.');
        }
    }
    const changeExpires = (date: MaterialUiPickersDate) => setExpires(date as Date);
    const uploadImg = async () => {
        if (imgFile && storageRef) {
            try {
                const upload = await storageRef.put(imgFile)
                const imgUrl = await upload.ref.getDownloadURL();
                console.log(imgUrl)
                return imgUrl;
            } catch (error) {
                console.error(error);
                setError('Something went wrong uploading image.');
                return null;
            }
        } else {
            return config.defaultImageUrl;
        }
    }
    const submit = async (event: SyntheticEvent) => {
        event.preventDefault();
        const imgUrl: string = await uploadImg();
        console.dir(imgUrl)
        if (imgUrl && user.displayName) {
            runMutation({
                active: true,
                // @ts-ignore
                created: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                ...(types[type].expires && {expires: expires}),
                imgUrl: imgUrl,
                displayName: title,
                type: type,
                userName: user.displayName,
                uid: user.uid,
            }).then(() => navigate(paths.public.userItems, {addSuccess: true}))
                .catch(error => {
                    console.error(error);
                    setError('Something went wrong posting item.');
                    if (storageRef) storageRef.delete().then(() => console.warn('Image deleted successfully.'))
                        .catch((error) => {
                            console.error(error);
                            console.error('Delete failed for: ' + imgUrl + '. File may be orphaned.');
                        });
                });
        }
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
                                               maxLength: dLength,
                                           }}
                                           fullWidth
                                           required
                                           multiline
                                           margin="dense"
                                           id="description"
                                           placeholder="Description"
                                           label="Description"
                                           helperText={description.length > 0 ? "Characters remaining: " + (dLength - description.length) : ""}
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

export type AddItemProps = {
    user: firebase.User,
}

const AddItem = ({user}: AddItemProps) => {
    const typesPath = collections.types;
    const itemsPath = collections.items;
    const orderBy: FirestoreQuery['orderBy'] = [{field: 'index', type: 'asc'}];

    return (
        <>
            <FirestoreMutation type="add" path={itemsPath}>
                {({runMutation}) => (
                    <FirestoreCollection path={typesPath} orderBy={orderBy}>
                        {({isLoading, ids, value}) => {
                            const types = value ? bindIds(true, ids, value) : {};
                            return isLoading ? (
                                <Loading/>
                            ) : (
                                <ItemForm runMutation={runMutation} types={types} user={user}/>
                            )
                        }}
                    </FirestoreCollection>
                )}
            </FirestoreMutation>
        </>
    )
};

export default AddItem;