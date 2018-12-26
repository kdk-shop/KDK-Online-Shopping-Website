import React ,{Component}from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import axios from 'axios'
import {Link} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import StarRating from 'react-star-rating-component';
import Star from '@material-ui/icons/Star'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
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
});
class MediaCard extends Component {
  constructor(){
    super();
    this.state={
      open:false,
      message:''
    }
  }
  onClick=()=>{

    const product={
      productId:this.props.id,
      qty:1
    }

    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    axios.post('/api/carts/',product)
      .then(res=>{
        this.setState({
          open:true,
          message:res.data.message
        })
        window.location="/products"
      })
      .catch(err=>{
        this.setState({
          open:true,
          message:err.response.data.message
        })
      })
  }
  handleClose = () => {
    this.setState({ open: false });
  };

  handleExit = ()=>{

  }
  render(){

    const { classes } = this.props;
    const show = this.props.available;
    return (
      <div>
        <Card className={classes.card}>
        <Grid container direction="column" justify="space-between" className={classes.fullHeight}>
          <Grid item className={classes.item} >
          <Link to={this.props.link} style={{ textDecoration: 'none' }}>
            <CardActionArea className={classes.fullHeight} style={{outline: 'none'}}>
              <CardMedia
                className={classes.media}
                image={this.props.image}
                title={this.props.title} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.props.brand} - {this.props.title}
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="h2">
                  <strong>${this.props.price}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
            </Link>
            </Grid>
            <Grid item >
            <CardActions>
              <Tooltip title="Buy">
              <IconButton  disabled={!show} onClick={this.onClick} style={{outline: 'none'}}>
                <ShoppingCart/>
              </IconButton>
              </Tooltip>
              <StarRating
                name='rate'
                editing={false}
                renderStartIcon={() => <span><Star /></span>}
                starCount={5}
                value={this.props.rate.score} />
              <Typography style={{ visibility: show ? "hidden" : "visible" }} className={classes.margin} gutterBottom variant="subtitle1" component="h2">
                Not Available
              </Typography>
            </CardActions>
            </Grid>
          </Grid>
        </Card>
        <Snackbar
        open={this.state.open}
        onClose={this.handleClose}
        transitionDuration={1500}
        onEntered={this.handleExit}
        TransitionComponent={TransitionUp}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.message}</span>}
      />
      </div>
    );
  }
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);
