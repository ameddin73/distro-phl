import React, {useState} from 'react';
import {itemStyle} from "../../../Common/styles";
import {Button, Card, CardContent, CardMedia, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
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
import {navigate} from 'hookrouter';

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

const ItemForm = ({runMutation, types, user}) => {
    const itemClasses = itemStyle();
    const classes = useStyles();
    const dLength = descriptionLength;

    const [error, setError] = useState(null);
    const [storageRef, setStorageRef] = useState();
    const [imgLocalImgUrl, setLocalImgUrl] = useState();
    const [imgFile, setImgFile] = useState();
    const [uploadRef, setUploadRef] = useState(null);
    const [expires, setExpires] = useState();
    const {value: title, bind: bindTitle} = useInput('');
    const {value: description, bind: bindDescription} = useInput('');
    const {value: type, bind: bindType} = useInput('');

    const changeFile = event => {
        const file = event.target.files[0];
        setLocalImgUrl(URL.createObjectURL(file));
        setImgFile(getFileWithUUID(file));
        setStorageRef(firebase.storage().ref().child(storage.itemImage + file.name));
    }
    const changeExpires = date => setExpires(date);
    const uploadImg = async () => {
        if (imgFile) {
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
    const submit = async (event) => {
        event.preventDefault();
        const imgUrl = await uploadImg();
        console.dir(imgUrl)
        if (imgUrl) {
            runMutation({
                created: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                expires: types[types.findIndex(({id}) => id === type)].expires ? expires : null,
                imgUrl: imgUrl,
                name: title,
                type: collections.types + type,
                userName: user.displayName,
                uid: user.uid,
            }).then(() => navigate(paths.public.userItems, {addSuccess: true}))
                .catch(error => {
                    console.error(error);
                    setError('Something went wrong posting item.');
                    storageRef.delete().then(() => console.warn('Image deleted successfully.'))
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
                    <Typography variant="h5" color="primary" justify="center" gutterBottom>
                        Post a new item.
                    </Typography>
                </Grid>
                {error && (
                    <Grid item xs>
                        <Typography variant="h5" color="primary" justify="center" gutterBottom>
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
                                    <IconButton onClick={() => uploadRef.click()}>
                                        <CameraAlt className={classes.upload}/>
                                    </IconButton>
                                </Grid>
                            }
                            <CardContent className={classes.content}>
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
                                        {types.map((type) => {
                                            return (
                                                <MenuItem key={type.id} value={type.id}>{type.displayName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                {types.findIndex(({id}) => id === type) >= 0 && types[types.findIndex(({id}) => id === type)].expires && (
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

const AddItem = ({user}) => {
    const typesPath = collections.types;
    const itemsPath = collections.items;
    const orderBy = [{field: 'index', type: 'asc'}];

    return (
        <>
            <FirestoreMutation type="add" path={itemsPath}>
                {({runMutation}) => (
                    <FirestoreCollection path={typesPath} orderBy={orderBy}>
                        {({isLoading, ids, value}) => {
                            const types = value ? bindIds({ids, value}) : [];
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