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
        reviews : this.props.reviews
    }

    componentWillMount(){
      for(let i=0;i<this.state.reviews.length;i++){
        this.totalScore=this.totalScore+this.state.reviews[i].score
        if(this.state.reviews[i].recommended){
          this.totalRecommended++
        }
      }
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
                    <ShoppingCart /> 
                  <Typography variant="h5"><strong>${this.props.price}</strong></Typography>
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
          
        </div>
      );
    }
}

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplexGrid);


