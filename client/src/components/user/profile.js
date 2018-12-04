import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class profile extends Component {
  constructor(){
    super();
    this.state={
        name:'',
        email:'',
        address:'',
        tel:'',
        errors:{},
        open:false
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
             this.setState({open:true , errors:''})          
         })
         .catch(err=>this.setState({errors:err.response.data}))
}

componentWillMount(){
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
           this.setState({errors:err.response.data})
          })
}

handleClose = () => {
  this.setState({ open: false });
};

handleExit = ()=>{
  window.location = "/"
}

  render() {
    const {errors}=this.state;
    return (
    <div className="create-profile ">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
      
            <h1 className="display-4 text-center">Edit Your Profile</h1>
            <p className="lead text-center">Let's get some information to make your profile stand out</p>

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
                <label>Addres</label> 
                <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.address})} placeholder="Address" name="address" value={this.state.address} onChange={this.onChange} id='address' />
                { errors.address && (<div className="invalid-feedback">{errors.address}</div>)}
              </div>

              <div className="form-group">
                <label>Mobile Phone</label> 
                <input type="text" className={classNames('form-control form-control-lg',{'is-invalid':errors.tel})} placeholder="989XXXXXXXXX" name="tel" value={this.state.tel} onChange={this.onChange} />
                {errors.tel && (<div className="invalid-feedback">{errors.tel}</div>)}
              </div>
              <small><Link to="/change-password">Want to change your password?</Link></small><br/>
              <input type="submit" className="btn btn-info mt-4" />{' '}
              <Link to="/" className="btn btn-danger mt-4">Cancel</Link> 
            </form>
            <br/>
            <label style={{color:'green'}}>{this.state.success}</label>
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
          message={<span id="message-id">Your Information has been updated successfuly</span>}
        />
  </div>
    )
  }
}

export default profile;
