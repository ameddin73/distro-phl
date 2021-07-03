import React, {SyntheticEvent, useState} from 'react';
import {Button, CardContent, CardMedia, Container, FormControlLabel, Grid, IconButton, Switch, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import {COLLECTIONS, PATHS, POST_DESCRIPTION_LENGTH, POST_NAME_LENGTH, STORAGE} from "util/config";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import theme from "util/theme";
import firebase from "firebase/app";
import 'firebase/storage';
import {Converters, getCompressedImages} from "util/utils";
import {useStorage, useUser} from "reactfire";
import {useHistory} from "react-router-dom";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {postCardStyle} from "../../../Common/Post/PostCard/styles";
import {Post, PostInterface} from "util/types";
import {loadingStyles} from "../../../Common/Loading/Loading";
import Animation from "./post-animation.svg";

const useStyles = makeStyles({
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
        paddingBottom: theme.spacing(2),
        float: 'left',
    },
    body: {
        fontSize: theme.typography.body2.fontSize,
    },
    error: {
        color: theme.palette.error.light,
        padding: theme.spacing(1),
        maxWidth: '240px',
    },
});

interface HTMLInputEvent extends SyntheticEvent {
    target: HTMLInputElement & EventTarget,
}

const NewPost = () => {
    const classes = useStyles();
    const loadingClasses = loadingStyles("40%")();
    const postClasses = postCardStyle();

    const {data: user} = useUser();
    const history = useHistory();
    const storage = useStorage();
    const [newPost] = useFirestoreAdd(COLLECTIONS.posts, Converters.PostConverter);

    let postRef: firebase.firestore.DocumentReference;

    const [post, _setPost] = useState<Post>(createEmptyPost(user));
    const setPost = postSetter(post, _setPost);

    const [localImgUrl, setLocalImgUrl] = useState<string>();
    const [imgFiles, setImgFiles] = useState<File[]>();
    const [storageRef, _setStorageRef] = useState<firebase.storage.Reference[]>();
    const setStorageRef = storageRefSetter(_setStorageRef, storage);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const changeFile = (event: HTMLInputEvent) => {
        if (!event.target.files) return;
        getCompressedImages(event.target.files[0]).then(files => {
            setLocalImgUrl(URL.createObjectURL(files[0]));
            setImgFiles(files);
            setStorageRef(files);
        }).catch(err => {
            console.error(err);
            setError('Something went wrong attaching image.');
        });
    };
    const cleanup = (err: Error) => {
        console.error(err);
        storageRef?.map(ref => ref?.delete()
            .then(() => console.warn('Image deleted successfully.'))
            .catch((e) => {
                console.error(e);
                console.error('Delete failed for: ' + ref.fullPath + '. File may be orphaned.');
            }));
        postRef?.delete().then(result => {
            console.warn(result);
        }).catch((e) => {
            console.error(e);
            console.error('Delete failed for: ' + postRef.id + '. Post may be orphaned.');
        });
    };
    const submit = async (event: SyntheticEvent) => {
        event.preventDefault();

        setError('');
        const newError = getError(post);
        if (newError) {
            setError(newError)
            return;
        }

        setLoading(true);
        try {
            if (imgFiles && storageRef) {
                await Promise.all(storageRef.map((ref, index) => {
                    return ref.put(imgFiles[index], {cacheControl: 'public,max-age=31536000'});
                }));
                post.image = storageRef[0].fullPath;
            }
            postRef = await newPost(post as PostInterface);
            setLoading(false);
            history.push(PATHS.public.userPosts);
        } catch (err) {
            setLoading(false);
            setError('Something went wrong uploading post.');
            cleanup(err);
        }
    }

    const image = localImgUrl ?
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
            <IconButton aria-label="upload-image" onClick={() => uploadRef?.click()}>
                <CameraAlt className={classes.upload}/>
            </IconButton>
        </Grid>

    const [uploadRef, setUploadRef] = useState<HTMLInputElement | null>(null);
    return (
        <>
            {loading ?
                <div className={loadingClasses.body}>
                    <object id="loading" aria-label="loading animation" data={Animation} className={loadingClasses.animation}/>
                </div> : <>
                    <Container maxWidth="sm" className={classes.container}>
                        <form onSubmit={submit}>
                            {image}
                            <CardContent>
                                <TextField value={post.name}
                                           onChange={event => setPost('name', event.target.value)}
                                           inputProps={{
                                               className: classes.title,
                                               maxLength: POST_NAME_LENGTH,
                                               "aria-label": "name",
                                           }}
                                           margin="dense"
                                           fullWidth
                                           required
                                           id="name"
                                           placeholder="Name"
                                           label="Name"
                                />
                                <TextField value={post.description}
                                           onChange={event => setPost('description', event.target.value)}
                                           className={classes.input}
                                           inputProps={{
                                               className: classes.body,
                                               maxLength: POST_DESCRIPTION_LENGTH,
                                               "aria-label": "description",
                                           }}
                                           fullWidth
                                           required
                                           multiline
                                           margin="dense"
                                           id="description"
                                           placeholder="Description"
                                           label="Description"
                                           helperText={descriptionHelperText(post.description)}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={post.hasExpiration}
                                            onChange={event => setPost('hasExpiration', event.target.checked)}
                                            name="has-expiration"
                                            color="primary"
                                            inputProps={{'aria-label': 'expiration-checkbox'}}
                                        />
                                    }
                                    label="Expires"
                                    className={classes.input}
                                />
                                {post.hasExpiration && (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker value={post.expires}
                                                            onChange={date => setPost('expires', date as Date)}
                                                            className={classes.input}
                                                            disableToolbar
                                                            format="MM/dd/yyyy"
                                                            margin="dense"
                                                            id="expiration-date-picker"
                                                            aria-label="expiration-date-picker"
                                                            label="Expiration Date"
                                                            inputProps={{'data-testid': 'expiration-date-picker'}}
                                        />
                                    </MuiPickersUtilsProvider>
                                )}
                                <Grid container direction="column">
                                    <Grid item xs style={{display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="body2" color="textSecondary" noWrap style={{paddingRight: theme.spacing(1)}}>
                                            Posted by
                                        </Typography>
                                        <Typography variant="button" noWrap>
                                            {user.displayName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Typography variant="subtitle2" className={classes.error} noWrap={false}>{error}</Typography>
                            <Button type="submit"
                                    variant="contained"
                                    disableElevation
                                    color="primary"
                                    className={classes.input}
                                    style={{padding: theme.spacing(1.5)}}>
                                Submit
                            </Button>
                        </form>
                    </Container>
                    <input hidden id="imageInput" data-testid="image-input" type="file" accept="image/*"
                           onChange={changeFile}
                           ref={(ref) => setUploadRef(ref)}/>
                </>}
        </>
    )
};

function postSetter(post: Post, _setPost: (newPost: Post) => void) {
    return function setPost<T extends keyof Post>(key: T, value: Post[T]) {
        _setPost({
            ...post,
            [key]: value,
        });
    }
}

function storageRefSetter(_setStorageRef: (newStorageRef: firebase.storage.Reference[]) => void, storage: firebase.storage.Storage) {
    return (files: File[]) => {
        _setStorageRef([
            storage.ref().child(STORAGE.postImages + files[0].name),
            storage.ref().child(STORAGE.postImages + files[1].name),
        ]);
    }
}

function createEmptyPost(user: firebase.User) {
    return {active: true, description: '', name: '', hasExpiration: false, uid: user.uid, userName: user.displayName || 'Distro User'}
}

function getError(post: Post) {
    if (!post.description || post.description === '') return 'Description cannot be empty.';
    if (!post.name || post.name === '') return 'Post name cannot be empty.';
    if (post.hasExpiration && !post.expires) return 'Expiration cannot be empty.';
}

function descriptionHelperText(description: string | undefined) {
    return description && description.length > 0 ? "Characters remaining: " + (POST_DESCRIPTION_LENGTH - description.length) : "";
}

export default NewPost;