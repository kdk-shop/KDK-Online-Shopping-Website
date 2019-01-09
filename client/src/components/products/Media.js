import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import StarRating from 'react-star-rating-component';
import {Star,Favorite} from '@material-ui/icons';
import Badge from '@material-ui/core/Badge';
import red from '@material-ui/core/colors/red';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton} from '@material-ui/core';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    fontSize: 30,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: "60vw",
  },
  image: {
    width:300,
    height: 500,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  badge: {
    top: -30,
    right: -39,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  
  },
  margin: {
    margin: "0 auto",
    color : "red",
    
  },
  favoritIcon:{
    color: red[800],
    marginLeft:'100%',
    marginTop:'-40px',
    fontSize: 35,
  },
  
});

class ComplexGrid extends Component {
  totalScore=parseInt('0');
  totalRecommended=parseInt('0');
    state={
        reviews : this.props.reviews,
        open:false,
        message:''
    }

    componentWillMount(){
      for(let i=0;i<this.state.reviews.length;i++){
        this.totalScore=this.totalScore+this.state.reviews[i].score
        if(this.state.reviews[i].recommended){
          this.totalRecommended++
        }
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
          window.location="/cart"
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
      // {console.log(this.state.reviews[0].score)}
        const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={16}>
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} alt={this.props.title} src={this.props.image} />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography gutterBottom variant="h5">
                      {this.props.title}
                    </Typography>
                    <Typography gutterBottom>{this.props.brand}</Typography>
                    <Typography gutterBottom>{this.props.description}</Typography>
                  </Grid>
                  <Grid item>
                  <Tooltip title="Buy" placement="top">
                    <IconButton disabled={!this.props.available} onClick={this.onClick} style={{outline: 'none'}}>
                      <ShoppingCart fontSize="large"/>
                    </IconButton>
                    </Tooltip>
                    <Typography style={{ visibility: this.props.available ? "hidden" : "visible" }} className={classes.margin} gutterBottom variant="subtitle1" component="h2">
                Not Available
              </Typography>
                  <Typography variant="h5"><strong>${this.props.price}</strong></Typography>
                  {this.props.discounted !== ''?<Typography color='error' variant="h5"><strong>${this.props.discounted}</strong></Typography>:null}
                </Grid>
                  <Grid item>
                  <StarRating 
                    name='rate'
                    renderStartIcon={()=><span><Star /></span>}
                    editing={false}
                    starCount={5}
                    value={(this.totalScore)/(this.state.reviews.length)}
                    />
                    <Tooltip title="Recommended" >
                        <Badge badgeContent={this.totalRecommended} color='primary' classes={{ badge: classes.badge }}>
                          <Favorite className={classes.favoritIcon} />
                        </Badge>
                    </Tooltip>
                </Grid>
                
                </Grid>
              
              </Grid>
            </Grid>
            
          </Paper>
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

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplexGrid);


