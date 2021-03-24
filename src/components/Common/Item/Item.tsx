import React, {useState} from 'react';
import {Card, CardActionArea, CardContent, ClickAwayListener, Collapse, Grid, Typography} from "@material-ui/core";
import {itemStyle} from "util/styles";
import {ItemInterface} from 'util/types';
import {DEFAULT_IMAGE} from "util/config";
import {StorageImage} from "reactfire";
import Loading from "../Loading";
import useItemTypes from "util/hooks/useItemTypes";

export type ItemProps = {
    item: ItemInterface,
    itemAction?: (item: ItemInterface) => JSX.Element,
}

const Item = ({item, itemAction = (() => (<div/>))}: ItemProps) => {
    const classes = itemStyle();

    const types = useItemTypes();
    const {displayName, description, image, type, userName} = item;
    const [openDesc, setOpenDesc] = useState(false);

    const clickCard = () => {
        setOpenDesc(!openDesc);
    };

    const clickAway = () => {
        setOpenDesc(false);
    };

    return (
        <Grid item xs>
            <ClickAwayListener onClickAway={clickAway}>
                <Card className={classes.card}>
                    <CardActionArea onClick={clickCard}>
                        <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? item.displayName : 'Default Image'}/>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {displayName}
                            </Typography>
                            <Collapse in={openDesc} collapsedHeight={100}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom noWrap>
                                    {types[type].displayName}
                                </Typography>
                                <Typography gutterBottom
                                            variant="body2"
                                            color="textPrimary">
                                    {description}
                                </Typography>
                                <Typography variant="body2">
                                    Supplied by:
                                </Typography>
                                <Typography variant="button">
                                    {userName}
                                </Typography>
                            </Collapse>
                        </CardContent>
                    </CardActionArea>
                    {itemAction(item)}
                </Card>
            </ClickAwayListener>
        </Grid>
    );
}

export default Item;
