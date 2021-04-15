import React from 'react';
import {ErrorBoundary} from "react-error-boundary";
import {StorageImage, useUser} from "reactfire";
import {COLLECTIONS, DEFAULT_IMAGE} from "util/config";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import Loading from "../Loading";
import {Container, Grid, Typography} from "@material-ui/core";
import {Converters, Query} from "util/utils";
import useFirestoreDocumentBuilder from "util/hooks/useFirestoreDocumentBuilder";
import {PostInterface} from "./types";
import useFirestoreCollectionBuilder from "../../../util/hooks/useFirestoreCollectionBuilder";
import UserAction from "../../User/UserPosts/UserAction/UserAction";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    hero: {
        position: "relative",
    },
    title: {
        color: "white",
        position: "absolute",
        bottom: 0,
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    gradient: {
        position: "absolute",
        width: '101%',
        height: '99%',
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))",
    },
    media: {
        width: '100%',
        height: 300,
        objectFit: 'cover',
    },
    body: {
        padding: theme.spacing(2),
    },
}));

const PostDetails = ({id}: { id: string }) => {
    const classes = useStyles();
    const {data: user} = useUser();

    const {data: post} = useFirestoreDocumentBuilder(COLLECTIONS.posts, id, Converters.PostConverter);
    const {name, description, image, hasExpiration, expires, userName, uid} = post;

    let postAction;
    if (user && user.uid === uid) {
        postAction = <UserAction post={post}/>;
    } else {
        postAction = <div>todo</div>;
    }
    return (
        <>
            <div className={classes.hero}>
                <div className={classes.gradient}/>
                <Container maxWidth="sm">
                    <Typography variant="h3" className={classes.title}>
                        {name}
                    </Typography>
                </Container>
                <ErrorBoundary fallback={
                    <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={DEFAULT_IMAGE} className={classes.media} alt={image ? name : 'Default Image'}/>
                }>
                    <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? name : 'Default Image'}/>
                </ErrorBoundary>
            </div>
            <Container maxWidth="sm" className={classes.body}>
                <Grid container
                      direction="column"
                      justify="flex-start"
                      spacing={2}
                      alignItems="flex-start">
                    <InfoItem title="Description" body={description}/>
                    {hasExpiration && expires?.getFullYear() === (new Date()).getFullYear() && (
                        <InfoItem title="Expires" body={'' + expires?.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}/>
                    )}
                    <InfoItem title="Posted by" body={userName}/>
                </Grid>
                {postAction}
            </Container>
        </>
    )
};

const InfoItem = ({title, body}: { title: string, body: string }) => (
    <Grid item>
        <Typography variant="h6" color="textSecondary">
            {title}
        </Typography>
        <Typography>
            {body}
        </Typography>
    </Grid>
);

const Post = () => {
    const {id} = useParams<{ id: string | undefined }>();
    const {data: posts} = useFirestoreCollectionBuilder<PostInterface>(COLLECTIONS.posts, {where: [Query.where.active]});

    if (!id || !posts.some(doc => doc.id === id)) return (<div>404</div>)

    return <PostDetails id={id}/>;
}

export default Post;
