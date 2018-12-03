import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import axios from 'axios'

class recoverPassword extends Component {
    constructor(){
        super();
        this.state={
            email:'',
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
               if (res.data.redirect === '/login') {
                 window.location = "/login"
               } else window.location = "/reset_pwd"
             })
             .catch(err=>this.setState({errors:err.response.data}))
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
            </div>
        )
    }
}
    
export default recoverPassword;