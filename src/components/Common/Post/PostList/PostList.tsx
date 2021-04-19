import React from 'react';
import {Container, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import NothingHere from "../../NothingHere/NothingHere";
import {FirestoreQuery, PostInterface} from "util/types";
import {Converters} from "util/utils";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import PostCard from '../PostCard/PostCard.lazy';
import {PostProps} from "../PostCard/PostCard";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        flexGrow: 1,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    container: {
        maxWidth: 'sm',
        padding: theme.spacing(2),
        alignItems: 'flex-start',
    },
    card: {
        display: "inline-block",
    },
}));

export type PostListProps = {
    path: string,
    query?: FirestoreQuery,
    filter?: (post: PostInterface) => boolean,
    postAction?: (post: PostProps) => JSX.Element,
}

const PList = ({path, query, filter, postAction}: PostListProps) => {
    const {data: posts} = useFirestoreCollectionBuilder(path, query, Converters.PostConverter);

    if (!posts || posts.length === 0)
        return (<NothingHere/>);

    const postList = filter ? posts.filter(filter) : posts;

    if (postList.length === 0)
        return (<NothingHere/>);
    return (<>
        {postList.map((post: PostInterface) => (<PostCard key={post.id} post={post} postAction={postAction}/>))}
    </>)
}

const PostList = (props: PostListProps) => {
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="md">
            <Grid container
                  alignItems="center"
                  justify="space-evenly"
                  spacing={2}
                  className={classes.container}>
                <PList {...props}/>
            </Grid>
        </Container>
    );
}

export default PostList;
