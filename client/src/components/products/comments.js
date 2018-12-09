import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import StarRating from 'react-star-rating-component';
import {Star,FavoriteBorder,Favorite} from '@material-ui/icons'
import red from '@material-ui/core/colors/red'
import Tooltip from '@material-ui/core/Tooltip';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    fontSize: 30,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width:'100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: "60vw",
  },
  iconHover: {
    fontSize: 30,
    margin: theme.spacing.unit * 1.25,
    '&:hover': {
      color: red[800],
    },
    marginLeft:'90%',
    marginTop:'-135px',
  },
  favoritIcon:{
    color: red[800],
    marginLeft:'90%',
    marginTop:'-140px'
  }
});


 class Comments extends Component {
  timesClicked =parseInt('0');
   constructor(){
     super();
     this.state={
      user:'',
      text:'',
      recommended:false,
      message:'',
      open:false,
      notAuth:true,
      score:0
     }
     this.onChange=this.onChange.bind(this);
     this.onSubmit=this.onSubmit.bind(this);
   }

    componentWillMount(){
      axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
      axios.get('/api/users/currentUser')
        .then(res=>{
          this.setState({
            user:res.data,
            notAuth:false
          })
        })
        .catch(()=>{
          this.setState({
            message:'You Need To Log In First'
          })
         })
    }

    onChange(e){
      this.setState({[e.target.name]:e.target.value})
    }

    onSubmit(e){
      e.preventDefault();

      const newComment={
        name:this.state.user.name,
        text:this.state.text,
        recommended:this.state.recommended,
        score:this.state.score
      }

      if(this.state.text!==''){
      axios.put(`/api/products/review/${this.props.comments._id}/${this.state.user._id}`,newComment)
        .then(res=>{
          this.setState({open:true,message:'Your Comment Has Sent Successfuly'})
        })
        .catch(err=>{
          this.setState({open:true})
          console.log("failed while sending comment")

      })
    }
    }

    handleClose = () => {
      this.setState({ open: false });
    };

    handleExit = ()=>{
      if(!this.state.notAuth)
        window.location = `/product/?id=${this.props.comments._id}`
 
    }

    handleRate = (next,prv,name)=>{
      this.setState({score:next})
  }
   
   handleRecommended = () => {
     this.timesClicked++;
     console.log(this.timesClicked)
     if(this.timesClicked%2===1){
        this.setState({recommended:true})
        document.getElementById('favorit').style.color = "red";
    }
    else{
        this.setState({recommended:false})
        document.getElementById('favorit').style.color = "black";
    }
     
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
              <Grid item xs={12} sm  container direction="column" spacing={16}>
                <Grid item xs>
                  <Typography gutterBottom variant="h5">
                  Comments
                  </Typography>
                </Grid>
                {this.props.comments.reviews.map((x)=>{
                  return(
                  <Grid item key={x.creatorId} >
                      <TextField 
                        disabled={true}
                        id="filled-multiline-static"
                        label={x.creatorName}
                        multiline
                        rows="4"
                        defaultValue={x.review}
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        />
                        <StarRating 
                          renderStartIcon={()=><span><Star/></span>}
                          editing={false}
                          starCount={5}
                          value={x.score}
                          name="score"
                           />
                          {x.recommended? <Favorite className={classes.favoritIcon}/>:''}
                        <hr/>
                 </Grid>
                  )
                  
                })}
                <Grid>
                  <form item onSubmit={this.onSubmit}>
                  
                      <TextField
                        id="filled-multiline-static"
                        label="New Comment"
                        multiline
                        rows="5"
                        value={this.state.text}
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        name="text"/>

                        <StarRating 
                        name='score'
                        renderStartIcon={()=><span><Star/></span>}
                        starCount={5}
                        onStarClick={this.handleRate}
                        value={this.state.score}/>
                          
                        <Tooltip title="Recommend">
                          <FavoriteBorder className={classes.iconHover} onClick={this.handleRecommended} name="recommended" value={this.state.recommended} id='favorit'/>
                        </Tooltip>
                          <br/>
                        <Button variant="contained" color="primary" type="submit" >
                          Send
                        </Button>
                  </form>
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
        message={<span id="message-id">{this.state.message}</span>}/>
    </div>
    )
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comments);