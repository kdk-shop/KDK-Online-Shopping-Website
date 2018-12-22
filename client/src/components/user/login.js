import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

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

 class login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
            open:false,
            errors:{},
            showPassword: false
        };
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }

    handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };
    onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    onSubmit(e){
        e.preventDefault();

        const user={
            email:this.state.email,
            password:this.state.password
        }

        axios.post('/api/users/login',user)
              .then(res=>{localStorage.setItem("jwt_token",res.data.token)
                      this.setState({open:true})
              })
              .catch(err=>this.setState({errors:err.response.data}))
    }

    onClick=()=>{
      window.location="/"
    } 
    handleClose = () => {
      this.setState({ open: false });
    };

    handleExit = ()=>{
      window.location = "/profile"
    }
    
  render() {
    const { classes } = this.props;
    return (
        <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your account</p>

              <form className={classes.container} noValidate  onSubmit={this.onSubmit}>
              <Grid item xs={12}>
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
              label="Password"
              type={this.state.showPassword ? 'text' : 'password'}
               className={classNames(classes.margin, classes.textField)}
              value={this.state.password}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment variant="filled" position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={this.state.errors.password}
              helperText={this.state.errors.password === "" ? ' ' :this.state.errors.password }
            />
                <Typography><Link to="/recover-password">Forgot Password?</Link></Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Button variant="contained" color="primary" className={classes.button} type="submit">
                    LogIn 
                </Button>
            
                <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClick}>
                    Cancel
                </Button>
                </Grid>
              </form>

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
          message={<span id="message-id">You Have Successfuly Logged In</span>}
        />
      </div>
    )
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(login);
