import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

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
         };
         this.onChange=this.onChange.bind(this);
         this.onSubmit=this.onSubmit.bind(this);
     }
     

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
  render() {

    const {errors}=this.state;
    return (
        <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Name</label> 
                  <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.name})} placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} />
                  {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                  <label>Email Address</label> 
                  <input type="email" className={classNames('form-control form-control-lg',{'is-invalid':errors.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">This site uses <a href="https://en.gravatar.com/" target="_blank">Gravatar</a> so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <label>Password</label> 
                  <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange}  />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                  <label>Confirmation</label> 
                  <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password2})} placeholder="Confirm Password" name="password2" value={this.state.password2} onChange={this.onChange} />
                  {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
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
          message={<span id="message-id">You have successfuly signed up in</span>}
        />
      </div>
    )
  }
}

export default register;