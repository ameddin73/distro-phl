import React from 'react';
import {DEFAULT_IMAGE} from "util/config";
import {StorageImage, useStorage} from "reactfire";
import {postCardStyle} from "../PostCard/styles";
import firebase from 'firebase/app';
import {ErrorBoundary} from "react-error-boundary";
import usePromise from "react-promise-suspense";

export type PostImageProps = {
    image: string,
    name: string,
}

const PostImage = ({image, name}: PostImageProps) => {
    const classes = postCardStyle();

    const thumbnailPath = image ? getThumbnailPath(image) : image;
    const thumbExists = usePromise(getDownloadUrl, [thumbnailPath, useStorage()]);

    const fullSize = <StorageImage suspense={true} storagePath={image} className={classes.media} alt={name}/>;
    const fallbackMedia = <img src={DEFAULT_IMAGE.thumbnail} className={classes.media} alt="Default thumbnail"/>;

    if (!image)
        return fallbackMedia;

    if (thumbExists !== true)
        return <ErrorBoundary fallback={fallbackMedia}>
            {fullSize}
        </ErrorBoundary>

    return <ErrorBoundary fallback={fallbackMedia}>
        <ErrorBoundary fallback={fullSize}>
            <StorageImage suspense={true} storagePath={thumbnailPath} className={classes.media} alt={`${name} thumbnail`}/>
        </ErrorBoundary>
    </ErrorBoundary>
}

const getDownloadUrl = (image: string, storage: firebase.storage.Storage) =>
    image ? storage.ref(image).getDownloadURL().then(() => true).catch(() => false) :
        Promise.resolve(false);

function getThumbnailPath(strToSearch: string) {
    const n = strToSearch.lastIndexOf('.');
    if (n < 0) return strToSearch;
    return strToSearch.substring(0, n) + '.thumbnail' + strToSearch.substring(n);
}

export default PostImage;