import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import axios from 'axios'
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

class changePassword extends Component {
    constructor(){
        super();
        this.state={
            password:'',
            password2:'',
            currentPassword:'',
            open:false,
            errors:{},
            showCurrentPassword: false,
            showPassword: false,
            showPassword2: false,

        };
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }

    handleClickShowCurrentPassword = () => {
        this.setState(state => ({ showCurrentPassword: !state.showCurrentPassword }));
      };
    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
      };
    handleClickShowPassword2 = () => {
        this.setState(state => ({ showPassword2: !state.showPassword2 }));
      };

    onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    onClick=()=>{
        window.location="/admin/panel"
    } 

    onSubmit(e){
        e.preventDefault();

        const newPassword={
            password:this.state.password,
            password2:this.state.password2,
            currentPassword:this.state.currentPassword
        }

        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
        axios.post('/api/users/change_pwd',newPassword)
             .then(res=>{
                this.setState({open:true})
             })
             .catch(err=>this.setState({errors:err.response.data}))
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
      <div className="changePassword">
       <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                </Typography>
                </Toolbar>
            </AppBar>
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Change Password</h1>
                    <p className="lead text-center">Change Your Current Password</p>
                    <form className={classes.container} noValidate autoComplete="off" onSubmit={this.onSubmit}>
                    <TextField
                        fullWidth
                        label="Current Password"
                        type={this.state.showCurrentPassword ? 'text' : 'password'}
                        className={classNames(classes.margin, classes.textField)}
                        value={this.state.currentPassword}
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        name="currentPassword"
                        InputProps={{
                            endAdornment: (
                            <InputAdornment variant="filled" position="end">
                                <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowCurrentPassword}
                                >
                                {this.state.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        error={this.state.errors.currentPassword}
                        helperText={this.state.errors.currentPassword === "" ? ' ' :this.state.errors.currentPassword }
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        className={classNames(classes.margin, classes.textField)}
                        value={this.state.Password}
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
                        type={this.state.showPassword2 ? 'text' : 'password'}
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
                                onClick={this.handleClickShowPassword2}
                                >
                                {this.state.showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                        error={this.state.errors.password2}
                        helperText={this.state.errors.password2=== "" ? ' ' :this.state.errors.password2 }
                    />
                        <Button variant="contained" color="primary" className={classes.button} type="submit">
                        Submit 
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
          message={<span id="message-id">Your Password Has Changed Succesfuly</span>}
        />
      </div>
    )
  }
}

changePassword.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(changePassword);