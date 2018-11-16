import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import {Link} from 'react-router-dom'

 class login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
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

        const user={
            email:this.state.email,
            password:this.state.password
        }

        axios.post('/api/users/login',user)
              .then(res=>{localStorage.setItem("jwt_token",res.data.token)
                      if (res.data.redirect === '/profile') {
                          window.location = "/profile"
                      } else window.location = "/login"
              })
              .catch(err=>this.setState({errors:err.response.data}))
    }
  render() {
    const {errors}=this.state;
    return (
        <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                   <label>Email Address</label>
                  <input type="email" className={classNames('form-control form-control-lg',{'is-invalid':errors.email})}  placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <input type="submit" className="btn btn-info mt-4" />{' '}
                <Link to="/" className="btn btn-danger mt-4">Cancel</Link> 
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default login;
