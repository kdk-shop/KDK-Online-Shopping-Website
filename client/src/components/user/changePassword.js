import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import axios from 'axios'

class changePassword extends Component {
    constructor(){
        super();
        this.state={
            password:'',
            password2:'',
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

        const newPassword={
            password:this.state.password,
            password2:this.state.password2
        }

        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
        axios.post('/api/users/change_pwd',newPassword)
             .then(res=>{
                 
               if (res.data.redirect === '/profile') {
                 window.location = "/profile"
               } else window.location = "/change_pwd"
             })
             .catch(err=>this.setState({errors:err.response.data}))
    }
  render() {

    const {errors}=this.state;
    return (
      <div className="changePassword">
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Change Password</h1>
                    <p className="lead text-center">Change Your Current Password</p>
                    <form noValidate  onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password})} 
                            placeholder="New Password" name="password" value={this.state.password} onChange={this.onChange}  />
                             {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" className={classNames('form-control form-control-lg',{'is-invalid':errors.password2})} 
                            placeholder="Confirm Password" name="password2"value={this.state.password2} onChange={this.onChange} />
                             {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
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

export default changePassword;