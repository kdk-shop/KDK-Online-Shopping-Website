import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
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
};

  const MediaCard = (props) => {
    const { classes } = props;
    return (
        <Card className={classes.card}>
          <CardActionArea>
                 <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.name} - {props.address}
                    </Typography>
               </CardContent>
          </CardActionArea>
        </Card>
    );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);
