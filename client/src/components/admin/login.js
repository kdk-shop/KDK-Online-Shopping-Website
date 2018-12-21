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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

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
            name:'',
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

        const admin={
            name:this.state.name,
            password:this.state.password
        }

        axios.post('/api/admins/login',admin)
              .then(res=>{
                      localStorage.setItem("jwt_token",res.data.token)
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
      window.location = "/admin/panel"
    }
    
  render() {
    const { classes } = this.props;
    return (
      <div className="login">
      <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    
                </Typography>
                </Toolbar>
            </AppBar>
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">Sign in to your account</p>

            <form className={classes.container} noValidate autoComplete="off" onSubmit={this.onSubmit}>
            <Grid item xs={12}>
            <TextField
            fullWidth
            label="Name"
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
