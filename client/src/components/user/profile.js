import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
      margin: theme.spacing.unit,
    },
});

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class profile extends Component {
  constructor(){
    super();
    this.state={
        name:'',
        email:'',
        address:'',
        tel:'',
        errors:{},
        open:false
    };
    this.onChange=this.onChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
  }


onChange(e){
    this.setState({[e.target.name]:e.target.value})
}

onSubmit(e){
    e.preventDefault();

    const updateUser={
        name:this.state.name,
        email:this.state.email,
        address:this.state.address,
        tel:parseInt(this.state.tel)

    }
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    axios.post('/api/users/profile',updateUser)
         .then(res=>{
             this.setState({open:true , errors:''})          
         })
         .catch(err=>this.setState({errors:err.response.data}))
}

componentWillMount(){
  axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
  axios.get('/api/users/profile')
         .then(res=>{
           this.setState({
            name:res.data.name,
            email:res.data.email,
            address:res.data.address,
            tel:res.data.tel,
           })
         })
         .catch(err=>{
           this.setState({errors:err.response.data})
          })
}

handleClose = () => {
  this.setState({ open: false });
};

handleExit = ()=>{
  window.location = "/"
}
onClick=()=>{
  window.location="/"
}
  render() {
    const { classes } = this.props;
    return (
    <div className="create-profile ">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
      
            <h1 className="display-4 text-center">Edit Your Profile</h1>
            <p className="lead text-center">Let's get some information to make your profile stand out</p>

            <form className={classes.container} noValidate  onSubmit={this.onSubmit}>
            <Grid item xs={12}>
              <TextField
              fullWidth
              label="Full Name"
              className={classes.textField}
              value={this.state.name}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="name"
              error={this.state.errors.name}
              helperText={this.state.errors.name === "" ? ' ' :this.state.errors.name }
            />
              <TextField
              fullWidth
              label="Email Address"
              className={classes.textField}
              value={this.state.email}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="email"
              error={this.state.errors.email}
              helperText={this.state.errors.email === "" ? ' ' :this.state.errors.email }
            />
              <TextField
              fullWidth
              label="Address"
              className={classes.textField}
              value={this.state.address}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="address"
              error={this.state.errors.address}
              helperText={this.state.errors.address === "" ? ' ' :this.state.errors.address }
            />
              <TextField
              fullWidth
              label="Tel number"
              className={classes.textField}
              placeholder="989XXXXXXXXX"
              value={this.state.tel}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="tel"
              error={this.state.errors.tel}
              helperText={this.state.errors.tel === "" ? ' ' :this.state.errors.tel }
            />
              
              <Typography><Link to="/change-password">Want to change your password?</Link></Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Button variant="contained" color="primary" className={classes.button} type="submit">
                    Submit 
                </Button>
            
                <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClick}>
                    Cancel
                </Button>
                </Grid>
            </form>
            <br/>
            <label style={{color:'green'}}>{this.state.success}</label>
          </div>
        </div>
      </div>
      <Snackbar
          open={this.state.open}
          onClose={this.handleClose}
          transitionDuration={1500}
          onEntered={this.handleExit}
          TransitionComponent={TransitionUp}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Your Information Has Updated Successfuly</span>}
        />
  </div>
    )
  }
}

profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(profile);
