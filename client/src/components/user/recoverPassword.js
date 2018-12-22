import React, { Component } from 'react'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

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

class recoverPassword extends Component {
    constructor(){
        super();
        this.state={
            email:'',
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

        const userEmail={
            email:this.state.email
        }

        axios.patch('/api/users/reset_pwd',userEmail)
             .then(res=>{  
                this.setState({open:true})
             })
             .catch(err=>this.setState({errors:err.response.data}))
    }
    hnandleClose = () => {
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
            <div className="recoverPassword">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Reset Password</h1>
                        <p className="lead text-center">Please enter your email address to request a password reset</p>
                        <form className={classes.container} noValidate  onSubmit={this.onSubmit}>
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
                            <Button variant="contained" color="primary" className={classes.button} type="submit">
                                Send 
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
          message={<span id="message-id">Your New Password Has Been Sent To Your Email Address</span>}
        />
            </div>
        )
    }
}
    
recoverPassword.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(recoverPassword);
  