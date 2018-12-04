import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

class recoverPassword extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            open:false,
            errors:{}
        };
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }

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
    handleClose = () => {
        this.setState({ open: false });
      };
  
      handleExit = ()=>{
        window.location = "/login"
      }
    render() {

        const {errors}=this.state;
        return (
            <div className="recoverPassword">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Reset Password</h1>
                        <p className="lead text-center">Please enter your email address to request a password reset</p>
                        <form noValidate  onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" className={classNames('form-control form-control-lg',{'is-invalid':errors.email})} 
                                placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange}  />
                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            </div>
                            <input type="submit" className="btn btn-info mt-4" />{' '}
                            <Link to="/" className="btn btn-danger mt-4">Cancel</Link> 
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
          message={<span id="message-id">Your new message has been sent to your email address</span>}
        />
            </div>
        )
    }
}
    
export default recoverPassword;