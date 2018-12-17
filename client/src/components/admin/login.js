import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

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

     
    handleClose = () => {
      this.setState({ open: false });
    };

    handleExit = ()=>{
      window.location = "/admin/panel"
    }
    
  render() {
    const {errors}=this.state;
    return (
        <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Administrator Log In</h1>
              <p className="lead text-center">Sign in to your account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                   <label>Name</label>
                  <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.name})}  placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} />
                  {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                {/* <small><Link to="/recover-password">Forgot Password?</Link></small><br/> */}
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
          message={<span id="message-id">You Have Successfuly Logged In</span>}
        />
      </div>
    )
  }
}

export default login;
