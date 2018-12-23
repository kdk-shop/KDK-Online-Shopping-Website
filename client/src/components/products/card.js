import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Star from '@material-ui/icons/Star'
import StarRating from 'react-star-rating-component';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

const styles = {
  card: {
    height:"100%",
    maxWidth: 345,
    margin: "0 auto"
  },
  media: {
    height: 200,
    width :150,
    margin: "0 auto"
  },
  margin: {
    margin: "0 auto",
    color : "red",
    
  },
  item:{
    flex: 1
  },
  fullHeight:{
    height:"100%"
  }
};

  const MediaCard = (props) => {
    const { classes } = props;
    // console.log(props.available)
    const show = props.available;
    return (
        <Card className={classes.card}>
        <Grid container direction="column" justify="space-between" className={classes.fullHeight}>
          <Grid item className={classes.item} >
            <CardActionArea className={classes.fullHeight}>
              <CardMedia
                className={classes.media}
                image={props.image}
                title={props.title} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {props.brand} - {props.title}
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="h2">
                  <strong>${props.price}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
            </Grid>
            <Grid item >
            <CardActions>
              <Tooltip title="Buy">
                <ShoppingCart />
              </Tooltip>
              <StarRating
                name='rate'
                editing={false}
                renderStartIcon={() => <span><Star /></span>}
                starCount={5}
                value={props.rate} />
              <Typography style={{ visibility: show ? "hidden" : "visible" }} className={classes.margin} gutterBottom variant="subtitle1" component="h2">
                Not Available
              </Typography>
            </CardActions>
            </Grid>
          </Grid>
        </Card>
    );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);
