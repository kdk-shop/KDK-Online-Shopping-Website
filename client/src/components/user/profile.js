import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames'

class profile extends Component {
  constructor(){
    super();
    this.state={
        name:'',
        email:'',
        location:'',
        tel:'',
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

    const updateUser={
        name:this.state.name,
        email:this.state.email,
        location:this.state.location,
        tel:this.state.tel,

    }

    axios.post('/api/users/profile',updateUser)
         .then(res=>{
           if (res.data.redirect === '/profile') {
             window.location = "/"
           } else window.location = "/profile"
           console.log(res.data)
         })
         .catch(err=>this.setState({errors:err.response.data}))
}
  render() {
    const {errors}=this.state;
    return (
      <div className="create-profile">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
    
          <h1 className="display-4 text-center">Edit Your Profile</h1>
          <p className="lead text-center">Let's get some information to make your profile stand out</p>

          <form noValidate onSubmit={this.onSubmit}>

             <div className="form-group">
                  <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.name})} placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} />
                  {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
        
                <div className="form-group">
                  <input type="email" className={classNames('form-control form-control-lg',{'is-invalid':errors.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
            
            <div className="form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Location" name="location" />
            </div>

            <div className="form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Tel" name="tel" />
            </div>

            <input type="submit" className="btn btn-info mt-4" />{' '}
            <Link to="/" className="btn btn-light mt-4">Cancel</Link> 

          </form>
        </div>
      </div>
    </div>
  </div>
    )
  }
}

export default profile;