import React, {useState} from 'react';
import {itemStyle} from "../../../Common/styles";
import {Card, CardContent, CardMedia, Grid, IconButton, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {CameraAlt} from "@material-ui/icons";
import {grey} from "@material-ui/core/colors";

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
    body: {
        fontSize: theme.typography.body2.fontSize,
    }
}));

const AddItem = ({user}) => {
    const itemClasses = itemStyle();
    const classes = useStyles();

    const [imgFile, setImgFile] = useState(null);
    const [uploadRef, setUploadRef] = useState(null);

    const changeFile = (event) => {
        setImgFile(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <>
            <input hidden id="imageInput" type="file" accept="image/*"
                   onChange={changeFile}
                   ref={(ref) => setUploadRef(ref)}/>
            <Grid container
                  direction="column"
                  alignItems="center"
                  className={classes.container}>
                <Grid item xs>
                    <Typography variant="h5" color="primary" justify="center" gutterBottom>
                        Post a new item.
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Card className={itemClasses.card}>
                        {imgFile ?
                            <CardMedia
                                className={itemClasses.media}
                                image={imgFile}
                                title="Uploaded Item Image"/>
                            :
                            <Grid container
                                  alignItems="center"
                                  direction="column"
                                  className={`${classes.mediaBox} ${itemClasses.media}`}>
                                <IconButton onClick={() => uploadRef.click()}>
                                    <CameraAlt className={classes.upload}/>
                                </IconButton>
                            </Grid>
                        }
                        <CardContent>
                            <TextField inputProps={{className: classes.title}}
                                       margin="dense"
                                       fullWidth
                                       required
                                       id="title"
                                       placeholder="Title"
                                       variant="outlined"
                            />
                            <TextField inputProps={{className: classes.body}}
                                       margin="dense"
                                       fullWidth
                                       required
                                       multiline
                                       id="description"
                                       placeholder="Description"
                                       variant="outlined"
                                       label={"Characters remaining: " + 250}
                            />
                            <Grid container direction="column">
                                <Grid item xs>
                                    <Typography gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                        description
                                    </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="body2">
                                        Supplied by:
                                    </Typography>
                                    <Typography variant="button">
                                        {/*{user.uid}*/}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
};

export default AddItem;
