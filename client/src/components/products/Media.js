import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import StarRating from 'react-star-rating-component';
import Star from '@material-ui/icons/Star';
import SimpleGrow from './Grow';
const styles = theme => ({
  root: {
    flexGrow: 1,
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
});

class ComplexGrid extends Component {

    state={
        rate : this.props.rate
    }
     handleRate = (next,prv,name)=>{
        this.setState({rate:next})
    }
    render(){
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
              </Grid>
              <Grid item>
                 <ShoppingCart />
              </Grid>
              <Grid item>
              <StarRating 
                name='rate'
                renderStartIcon={()=><span><Star /></span>}
                starCount={5}
                value={this.state.rate} 
                onStarClick={this.handleRate}/>
            </Grid>
            
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">${this.props.price}</Typography>
            </Grid>
          </Grid>
        </Grid>
        
      </Paper>
      
    </div>
  );
    }
  
}

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplexGrid);


