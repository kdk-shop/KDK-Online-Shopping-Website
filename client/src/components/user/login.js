import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'

 class login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
            errors:{},
            success:''
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
        //console.log(user)
        axios.post('/api/users/login',user)
        .then(res=>{
          console.log(res.data);
          this.setState({
            //status:'You have successfully logged in to your account, in the next sprint, you will be redirected to your profile page!'
            status:`Dear ${user.email} you\'ve successfully logged into your account,
            in the next sprint, you\'ll be redirected to your profile page. 
            thank you for your patience!`
          })
        })
        .catch(err=>this.setState(
          {errors:err.response.data ,status:''}))
    }
  render() {
    const {errors}=this.state;
    let {status}=this.state;
    return (
        <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="email" className={classNames('form-control form-control-lg',{'is-invalid':errors.email})}  placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                  <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
                {status && (<div style={{color:'green'}}>{status}</div>)}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default login;