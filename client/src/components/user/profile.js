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
        address:'',
        tel:'',
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

    const updateUser={
        name:this.state.name,
        email:this.state.email,
        address:this.state.address,
        tel:parseInt(this.state.tel)

    }
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    axios.post('/api/users/profile',updateUser)
         .then(res=>{

           if (res.data.redirect === '/profile') {
             this.setState({success:'Information has been changed successfully.',errors:{}})
           }
         })
         .catch(err=>this.setState({errors:err.response.data}))
}

componentDidMount(){
  axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
  axios.get('/api/users/profile')
         .then(res=>{
           this.setState({

            name:res.data.name,
            email:res.data.email,
            address:res.data.address,
            tel:res.data.tel,
           })
         })
         .catch(err=>{
           this.setState({errors:err.response.data,success:''})
          })
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
              <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.address})} placeholder="Address" name="address" value={this.state.address} onChange={this.onChange} id='address' />
              { errors.address && (<div className="invalid-feedback">{errors.address}</div>)}
            </div>

            <div className="form-group">
              <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.tel})} placeholder="Tel" name="tel" value={this.state.tel} onChange={this.onChange} />
              {errors.tel && (<div className="invalid-feedback">{errors.tel}</div>)}
            </div>

            <input type="submit" className="btn btn-info mt-4" />{' '}
            <Link to="/" className="btn btn-light mt-4">Cancel</Link> 
          </form>
          <br/>
          <label style={{color:'green'}}>{this.state.success}</label>
        </div>
      </div>
    </div>
  </div>
    )
  }
}

export default profile;
