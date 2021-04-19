import React from 'react';
import {ErrorBoundary} from "react-error-boundary";
import {StorageImage, useUser} from "reactfire";
import {COLLECTIONS, DEFAULT_IMAGE} from "util/config";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import Loading from "../Loading";
import {Container, Grid, Typography} from "@material-ui/core";
import {Converters, PostQuery} from "util/utils";
import useFirestoreDocumentBuilder from "util/hooks/useFirestoreDocumentBuilder";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import UserAction from "../../User/UserPosts/UserAction/UserAction";
import DistroAction from "../../DistroHub/DistroAction/DistroAction";
import {PostInterface} from "util/types";
import theme from "util/theme";

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
        width: '100%',
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
    action: {
        paddingTop: theme.spacing(2),
        marginLeft: "auto",
        width: '100%',
    }
}));

const PostDetails = ({id}: { id: string }) => {
    const classes = useStyles();
    const {data: user} = useUser();

    const {data: post} = useFirestoreDocumentBuilder(COLLECTIONS.posts, id, Converters.PostConverter);
    const {name, description, image, hasExpiration, expires, userName, uid} = post;

    let postAction;
    let offerTitle;
    if (user && user.uid === uid) {
        postAction = <UserAction post={post}/>;
        offerTitle = 'Offers';
    } else {
        postAction = <DistroAction post={post}/>;
        offerTitle = '';
    }
    return (
        <>
            <div className={classes.hero}>
                <div className={classes.gradient}/>
                <Container maxWidth="sm">
                    <Typography variant="h4" className={classes.title}>
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
                    <InfoItem title="Posted by" body={userName} inline/>
                    {hasExpiration && expires?.getFullYear() === (new Date()).getFullYear() && (
                        <InfoItem inline title="Expires" body={'' + expires?.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}/>
                    )}
                    <InfoItem title="Description" body={description}/>
                    <InfoItem title={offerTitle} body=""/>
                </Grid>
                <div className={classes.action}>
                    {postAction}
                </div>
            </Container>
        </>
    )
};

const InfoItem = ({title, body, inline = false}: { title: string, body: string, inline?: boolean }) => (
    <Grid item style={inline ? {display: 'flex', alignItems: 'center'} : undefined}>
        <Typography variant="subtitle1" color="textSecondary">
            {title}
        </Typography>
        <Typography variant="body1" style={inline ? {paddingLeft: theme.spacing(1)} : undefined}>
            {body}
        </Typography>
    </Grid>
);

const Post = () => {
    const {id} = useParams<{ id: string | undefined }>();
    const {data: posts} = useFirestoreCollectionBuilder<PostInterface>(COLLECTIONS.posts, {where: [PostQuery.where.active]});

    if (!id || !posts.some(doc => doc.id === id)) return (<div>404</div>)

    return <PostDetails id={id}/>;
}

export default Post;
