import React from 'react';
import {ErrorBoundary} from "react-error-boundary";
import {StorageImage, useFirestore, useFirestoreDocData, useUser} from "reactfire";
import {COLLECTIONS, DEFAULT_IMAGE} from "util/config";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import {PostInterface} from "./types";
import Loading from "../Loading";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    media: {
        width: '100%',
        height: 360,
        objectFit: 'cover',
    },
}));

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const Post = () => {
    const classes = useStyles();
    const firestore = useFirestore();
    const user = useUser();
    const {id} = useParams<{ id: string | undefined }>();

    const ref = firestore.collection(COLLECTIONS.posts).doc(id);
    const {data: post} = useFirestoreDocData<PostInterface>(ref);
    const {name, description, image, userName} = post;

    return (
        <ErrorBoundary fallback={
            <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
        }>
            <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
        </ErrorBoundary>
    )
};

export default Post;
