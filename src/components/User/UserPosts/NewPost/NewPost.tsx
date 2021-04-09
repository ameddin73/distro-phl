import React, {SyntheticEvent, useState} from 'react';
import {postStyle} from "util/styles";
import {Button, Card, CardContent, CardMedia, Grid, IconButton, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import {COLLECTIONS, DESCRIPTION_LENGTH, PATHS, STORAGE} from "util/config";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import theme from "util/theme";
import 'firebase/storage';
import {Converters, getFileWithUUID} from "util/utils";
import {useStorage, useUser} from "reactfire";
import firebase from "firebase";
import {useHistory} from "react-router-dom";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {PostBuilder} from "../../../Common/Post/types";

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

const NewPost = () => {
    const classes = useStyles();
    const postClasses = postStyle();
    const path = COLLECTIONS.posts;

    const {data: user} = useUser();
    const history = useHistory();
    const storage = useStorage();

    const post = new PostBuilder({uid: user.uid, userName: user.displayName || 'Distro User'});
    let postRef: firebase.firestore.DocumentReference;

    const [newPost] = useFirestoreAdd(path, Converters.PostConverter);

    const [error, setError] = useState<string | null>(null);
    const [localImgUrl, setLocalImgUrl] = useState<string>();
    const [imgFile, setImgFile] = useState<File>();
    const [storageRef, setStorageRef] = useState<firebase.storage.Reference>();
    const [uploadRef, setUploadRef] = useState<HTMLInputElement | null>(null);

    if (!user) return null;

    const changeFile = (event: HTMLInputEvent) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setLocalImgUrl(URL.createObjectURL(file));
            setImgFile(getFileWithUUID(file));
            setStorageRef(storage.ref().child(STORAGE.postImages + file.name));
        } else {
            console.error('event.target.files[0] may be null');
            setError('Something went wrong attaching image.');
        }
    };
    const uploadImg = () => {
        if (imgFile && storageRef) return storageRef.put(imgFile);
        setError('Something went wrong uploading image.');
        throw new Error('Error uploading image. Image file or storage reference was not defined.');
    };
    const cleanup = (error: Error) => {
        console.error(error);
        if (storageRef) storageRef.delete().then(() => console.warn('Image deleted successfully.'))
            .catch((error: Error) => {
                console.error(error);
                console.error('Delete failed for: ' + storageRef.fullPath + '. File may be orphaned.');
            });
        if (postRef) {
            postRef.delete();
        }
    };
    const submit = (event: SyntheticEvent) => {
        event.preventDefault();

        const complete = post.isComplete();
        if (complete !== true) {
            setError(complete);
            return;
        }

        if (storageRef) {
            post.image = storageRef.fullPath;
            uploadImg().catch((error: Error) => {
                setError('Something went wrong uploading image.');
                cleanup(error);
            });
        }
        newPost(post).then(ref => {
            postRef = ref;
        }).catch(error => {
            setError('Something went wrong uploading post.');
            cleanup(error);
        })

        history.push(PATHS.public.userPosts, {addSuccess: true});
    };

    return (
        <>
            <Grid container
                  direction="column"
                  alignItems="center"
                  className={classes.container}>
                <Grid item xs>
                    <Typography variant="h5" color="primary" align="center" gutterBottom>
                        New Post
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
                    <Card className={postClasses.card}>
                        <form onSubmit={submit}>
                            {localImgUrl ?
                                <CardMedia
                                    className={postClasses.media}
                                    image={localImgUrl}
                                    aria-label="uploaded-image"
                                    title="Uploaded Image"/>
                                :
                                <Grid container
                                      alignItems="center"
                                      direction="column"
                                      className={`${classes.mediaBox} ${postClasses.media}`}>
                                    <IconButton aria-label="upload-image" onClick={() => {
                                        if (uploadRef) uploadRef.click();
                                    }}>
                                        <CameraAlt className={classes.upload}/>
                                    </IconButton>
                                </Grid>
                            }
                            <CardContent>
                                <TextField value={post.name}
                                           onChange={event => post.name = event.target.value}
                                           inputProps={{className: classes.title}}
                                           margin="dense"
                                           fullWidth
                                           required
                                           id="name"
                                           placeholder="Item Name"
                                           label="Name"
                                />
                                {post.hasExpiration && (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker value={post.expires}
                                                            onChange={date => post.expires = date as Date}
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
                                <TextField value={post.description}
                                           onChange={event => post.description = event.target.value}
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
                                           helperText={post.description && post.description.length > 0 ? "Characters remaining: " + (DESCRIPTION_LENGTH - post.description.length) : ""}
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
            <input hidden id="imageInput" data-testid="image-input" type="file" accept="image/*"
                   onChange={changeFile}
                   ref={(ref) => setUploadRef(ref)}/>
        </>
    )
};

export default NewPost;