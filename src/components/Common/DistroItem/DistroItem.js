import React from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid, makeStyles, Typography} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import {withStyles} from "@material-ui/styles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    pad: {
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
        maxWidth: 340,
    },
    media: {
        height: 140,
        objectFit: 'fill',
    },
    content: {
        maxHeight: 100,
        textOverflow: 'ellipsis',
    },
}));

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const DistroItem = ({item: {id, name, type, description, imgUrl, created, expiresFirst, expiresLast, count, uid, ...item}}) => {
    const classes = useStyles();

    return (
        <Grid item xs>
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={imgUrl}
                        title={name}/>
                    <CardContent className={classes.content}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p">
                            {description}
                        </Typography>
                    </CardContent>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography className={classes.heading}>Add to Cart</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Count: {count}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

export default DistroItem;
