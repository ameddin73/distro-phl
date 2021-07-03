import React from 'react';
import {ErrorBoundary} from "react-error-boundary";
import {StorageImage} from "reactfire";
import {COLLECTIONS, DEFAULT_IMAGE} from "util/config";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import Loading from "../Loading/Loading";
import {Container, Grid, Typography} from "@material-ui/core";
import {Converters, PostQuery} from "util/utils";
import useFirestoreDocumentBuilder from "util/hooks/useFirestoreDocumentBuilder";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import {PostInterface} from "util/types";
import theme from "util/theme";
import NotFound from "../NotFound";
import {ClassNameMap} from "@material-ui/styles";

const useStyles = makeStyles({
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
});

const PostDetails = ({id}: { id: string }) => {
    const classes = useStyles();

    const {data: post} = useFirestoreDocumentBuilder(COLLECTIONS.posts, id, Converters.PostConverter);
    const {name, description, image, hasExpiration, expires, userName} = post;

    const media = buildMedia(image, name, classes);

    return (
        <>
            <div className={classes.hero}>
                <div className={classes.gradient}/>
                <Container maxWidth="sm">
                    <Typography variant="h4" className={classes.title}>
                        {name}
                    </Typography>
                </Container>
                {media}
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
                </Grid>
            </Container>
        </>
    )
};

function buildMedia(image: string, name: string, classes: ClassNameMap) {
    const fallbackMedia = <img alt="Default" className={classes.media} src={DEFAULT_IMAGE.small} srcSet={`${DEFAULT_IMAGE.small} 480w, ${DEFAULT_IMAGE.medium} 720w, ${DEFAULT_IMAGE.large} 1200w`}/>;
    const media = image ?
        <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image} className={classes.media} alt={name}/>
        : fallbackMedia;
    return <ErrorBoundary fallback={fallbackMedia}>{media}</ErrorBoundary>
}

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

    if (!id || !posts.some(doc => doc.id === id)) return (<NotFound/>);

    return <PostDetails id={id}/>;
}

export default Post;
