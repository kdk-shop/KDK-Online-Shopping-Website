import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
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

 class register extends Component {
     constructor(){
         super();
         this.state={
             name:'',
             email:'',
             password:'',
             password2:'',
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

         const newUser={
             name:this.state.name,
             email:this.state.email,
             password:this.state.password,
             password2:this.state.password2,

         }
         //console.log(newUser)
         axios.post('/api/users/register',newUser)
              .then(res=>{
                this.setState({open:true})
              })
              .catch(err=>this.setState({errors:err.response.data}))
     }

     handleClose = () => {
      this.setState({ open: false });
    };

    handleExit = ()=>{
      window.location = "/login"
    }
    onClick=()=>{
      window.location="/"
  }
  render() {

    const { classes } = this.props;
    return (
        <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your account</p>
              <form className={classes.container} noValidate autoComplete="off" onSubmit={this.onSubmit}>
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
          <TextField
             fullWidth
              label="Confirm Password"
              type={this.state.showPassword ? 'text' : 'password'}
               className={classNames(classes.margin, classes.textField)}
              value={this.state.password2}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="password2"
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
              error={this.state.errors.password2}
              helperText={this.state.errors.password2 === "" ? ' ' :this.state.errors.password2 }
            />
             <Button variant="contained" color="primary" className={classes.button} type="submit">
                    SignUp 
                </Button>
            
                <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClick}>
                    Cancel
                </Button>
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
          message={<span id="message-id">You Save Successfuly Signed Up</span>}
        />
      </div>
    )
  }
}

register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(register);