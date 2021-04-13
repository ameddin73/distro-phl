import React, {SyntheticEvent, useState} from 'react';
import {postStyle} from "util/styles";
import {Button, Card, CardContent, CardMedia, FormControlLabel, Grid, IconButton, Switch, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";
import {COLLECTIONS, DESCRIPTION_LENGTH, PATHS, STORAGE} from "util/config";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import theme from "util/theme";
import firebase from "firebase/app";
import 'firebase/storage';
import {Converters, getFileWithUUID} from "util/utils";
import {useStorage, useUser} from "reactfire";
import {useHistory} from "react-router-dom";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {Post, PostInterface} from "../../../Common/Post/types";

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
}));

interface HTMLInputEvent extends SyntheticEvent {
    target: HTMLInputElement & EventTarget,
}

const NewPost = () => {
    const classes = useStyles();
    const postClasses = postStyle();

    const {data: user} = useUser();
    const history = useHistory();
    const storage = useStorage();

    const [post, _setPost] = useState<Post>({active: true, description: '', name: '', hasExpiration: false, uid: user.uid, userName: user.displayName || 'Distro User'});

    function setPost<T extends keyof Post>(key: T, value: Post[T]) {
        _setPost({
            ...post,
            [key]: value,
        })
    }

    const [newPost] = useFirestoreAdd(COLLECTIONS.posts, Converters.PostConverter);

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

    let postRef: firebase.firestore.DocumentReference;
    const cleanup = (error: Error) => {
        console.error(error);
        if (storageRef) {
            storageRef.delete().then(() => console.warn('Image deleted successfully.'))
                .catch((error: Error) => {
                    console.error(error);
                    console.error('Delete failed for: ' + storageRef.fullPath + '. File may be orphaned.');
                });
        }
        if (postRef) {
            postRef.delete().then(result => {
                console.warn(result);
            }).catch((error: Error) => {
                console.error(error);
                console.error('Delete failed for: ' + postRef.id + '. Post may be orphaned.');
            });
        }
    };
    const submit = (event: SyntheticEvent) => {
        event.preventDefault();
        setError('');

        if (!post.description) setError('Description cannot be empty.');
        if (!post.name) setError('Post name cannot be empty.');
        if (post.hasExpiration && !post.expires) setError('Expiration cannot be empty.');
        if (error) return;

        if (storageRef) {
            post.image = storageRef.fullPath;
            uploadImg().catch((error: Error) => {
                setError('Something went wrong uploading image.');
                cleanup(error);
                return;
            });
        }
        newPost(post as PostInterface).then(ref => {
            postRef = ref;
            if (error && error !== '') {
                cleanup(new Error('Error occurred during creation.'));
            } else {
                history.push(PATHS.public.userPosts);
            }
        }).catch(error => {
            setError('Something went wrong uploading post.');
            cleanup(error);
        })
    };

    return (
        <>
            <Grid container
                  direction="column"
                  alignItems="center"
                  className={classes.container}>
                <Grid item xs className={classes.container}>
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
                                           onChange={event => setPost('name', event.target.value)}
                                           inputProps={{className: classes.title, "aria-label": "name"}}
                                           margin="dense"
                                           fullWidth
                                           required
                                           id="name"
                                           placeholder="Item Name"
                                           label="Name"
                                />
                                <TextField value={post.description}
                                           onChange={event => setPost('description', event.target.value)}
                                           className={classes.input}
                                           inputProps={{
                                               className: classes.body,
                                               maxLength: DESCRIPTION_LENGTH,
                                               "aria-label": "description",
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