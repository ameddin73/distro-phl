import React, {SyntheticEvent, useState} from 'react';
import {Button, CardContent, CardMedia, Container, FormControlLabel, Grid, IconButton, Switch, TextField, Typography} from "@material-ui/core";
import {CameraAlt} from "@material-ui/icons";
import {COLLECTIONS, PATHS, POST_DESCRIPTION_LENGTH, POST_NAME_LENGTH, STORAGE} from "util/config";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import theme from "util/theme";
import firebase from "firebase/app";
import 'firebase/storage';
import {Converters, getCompressedImages} from "util/utils";
import {useStorage, useUser} from "reactfire";
import {useHistory} from "react-router-dom";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {postCardStyle} from "../../../Common/Post/PostCard/styles";
import {Post, PostInterface} from "util/types.distro";
import Loading, {loadingStyles} from "../../../Common/Loading/Loading";
import Animation from "./post-animation.svg";
import {ClassNameMap} from "@material-ui/styles";
import {useStyles} from "./styles";

const NewPost = () => {
    const classes = useStyles();
    const loadingClasses = loadingStyles("40%")();

    const {data: user} = useUser();
    const history = useHistory();
    const storage = useStorage();
    const [savePost] = useFirestoreAdd(COLLECTIONS.posts, Converters.PostConverter);

    let postRef: firebase.firestore.DocumentReference;

    const [post, _setPost] = useState<Post>(createEmptyPost(user));
    const setPost = postSetter(post, _setPost);

    const [localImgUrl, setLocalImgUrl] = useState<string>();
    const [imgFiles, setImgFiles] = useState<File[]>();
    const [storageRef, _setStorageRef] = useState<firebase.storage.Reference[]>();
    const setStorageRef = storageRefSetter(_setStorageRef, storage);

    const [error, setError] = useState('');
    const [imageProcessing, setImageProcessing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [uploadRef, setUploadRef] = useState<HTMLInputElement | null>(null);

    /*
    Update file objects for storage and html URL when new image uploaded
     */
    const changeFile = (event: HTMLInputEvent) => {
        if (!event.target.files) return;
        setImageProcessing(true);
        getCompressedImages(event.target.files[0]).then(files => {
            setLocalImgUrl(URL.createObjectURL(files[0]));
            setImgFiles(files);
            setStorageRef(files);
            setImageProcessing(false);
        }).catch(err => {
            console.error(err);
            setError('Something went wrong attaching image.');
            setImageProcessing(false);
        });
    };
    /*
    Delete orphaned storage objects in case of error
     */
    const cleanup = (err: Error) => {
        console.error(err);
        // Delete orphaned images
        storageRef?.map(ref => ref?.delete()
            .then(() => console.warn('Image deleted successfully.'))
            .catch((e) => {
                console.error(e);
                console.error(`Delete failed for: ${ref.fullPath}. File may be orphaned.`);
            }));
        // Log error if rollback incomplete
        postRef?.delete().then(result => {
            console.warn(result);
        }).catch((e) => {
            console.error(e);
            console.error(`Delete failed for: ${postRef.id}. Post may be orphaned.`);
        });
    };
    /*
    Upload storage refs and create post. Rollback if transaction fails partially.
     */
    const submit = async (event: SyntheticEvent) => {
        event.preventDefault();

        // Validate form
        setError('');
        const newError = getError(post);
        if (newError) {
            setError(newError)
            return;
        }

        setLoading(true);
        try {
            // Upload images
            if (imgFiles && storageRef) {
                await Promise.all(storageRef.map((ref, index) => {
                    // Important! Sets cache to 1 year which helps network access and keeps storage items on CDN
                    return ref.put(imgFiles[index], {cacheControl: 'public,max-age=31536000'});
                }));
                post.image = storageRef[0].fullPath;
            }
            // Store Post in Firestore
            postRef = await savePost(post as PostInterface);

            // Navigate to user posts
            setLoading(false);
            history.push(PATHS.public.userPosts);
        } catch (err) {
            // Set error message and rollback changes where possible
            setLoading(false);
            setError('Something went wrong uploading post.');
            cleanup(err);
        }
        setLoading(false);
    }

    // Build image component
    const image = buildImage({
        classes,
        imageProcessing,
        uploadRef,
        localImgUrl
    });

    return (
        <>
            {loading ?
                <div className={loadingClasses.body}>
                    <object id="loading" aria-label="loading animation" data={Animation} className={loadingClasses.animation}/>
                </div>
                :
                <>
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
                                           helperText={charactersRemaining(post.description)}
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

// TS definition for HTML Input
interface HTMLInputEvent extends SyntheticEvent {
    target: HTMLInputElement & EventTarget,
}

/*
Convenience method for building the image header dynamically based on state of attached
file.
 */
type ImageComponentProps = {
    classes: ClassNameMap,
    imageProcessing: boolean,
    uploadRef: HTMLInputElement | null,
    localImgUrl: string | undefined,
};

function buildImage({classes, imageProcessing, uploadRef, localImgUrl}: ImageComponentProps) {
    const postClasses = postCardStyle();

    // Build button for uploading image
    const noImage =
        <Grid container
              alignItems="center"
              direction="column"
              className={`${classes.mediaBox} ${postClasses.media}`}>
            {imageProcessing ?
                <Loading/>
                :
                <IconButton aria-label="upload-image" onClick={() => uploadRef?.click()}>
                    <CameraAlt className={classes.upload}/>
                </IconButton>
            }
        </Grid>;
    // Return image if exists or button
    return localImgUrl ?
        <CardMedia
            className={postClasses.media}
            image={localImgUrl}
            aria-label="uploaded-image"
            title="Uploaded Image"/>
        : noImage;
}

// Convenience method for updating the form-defined Post state by key
function postSetter(post: Post, _setPost: (newPost: Post) => void) {
    return function setPost<T extends keyof Post>(key: T, value: Post[T]) {
        _setPost({
            ...post,
            [key]: value,
        });
    }
}

// Convenience method for updating storage ref state with both files
function storageRefSetter(_setStorageRef: (newStorageRef: firebase.storage.Reference[]) => void, storage: firebase.storage.Storage) {
    return (files: File[]) => {
        _setStorageRef([
            storage.ref().child(STORAGE.postImages + files[0].name),
            storage.ref().child(STORAGE.postImages + files[1].name),
        ]);
    }
}

// Convenience method for creating an empty post object for state
function createEmptyPost(user: firebase.User) {
    return {
        active: true,
        description: '',
        name: '',
        hasExpiration: false,
        uid: user.uid,
        userName: user.displayName || 'Distro User'
    }
}

// Dynamically generate appropriate error when submit is used on incomplete post
function getError(post: Post) {
    if (!post.description || post.description === '') return 'Description cannot be empty.';
    if (!post.name || post.name === '') return 'Post name cannot be empty.';
    if (post.hasExpiration && !post.expires) return 'Expiration cannot be empty.';
}

// Convenience method for calculating text remaining
function charactersRemaining(description: string | undefined) {
    return description && description.length > 0 ? `Characters remaining: ${POST_DESCRIPTION_LENGTH - description.length}` : '';
}

export default NewPost;