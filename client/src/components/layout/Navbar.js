import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'


import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


class Navbar extends Component {

  state = {
    isLogin: false,
    open:false
  }
  componentDidMount(){
    console.log(localStorage.getItem("jwt_token"))
    if(localStorage.getItem("jwt_token")){
      this.setState({isLogin:true})
    }else{
      this.setState({isLogin:false})
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleExit = ()=>{
    window.location = "/"
  }

  logout = (event)=>{
    if(this.state.isLogin){
      localStorage.removeItem("jwt_token")
      axios.get('/api/users/logout')
         .then(res=>{
           this.setState({isLogin:false,open:true})
         })
         .catch(err=>console.log(err))
    }
  }

  
  render() {
    
    return (
        <nav className="navbar navbar-expand-sm navbar-dark  mb-4" style={{ background: '#2b2f35' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">Home</Link>
          <Link className="navbar-brand" to="/products">Products</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">

            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
              </li>
            </ul>
    
            <ul className="navbar-nav ml-auto">
            <li className="nave-item">
            
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={this.state.isLogin?"/profile":"/register"}>{this.state.isLogin?"Profile":"Sign Up"}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" onClick={this.logout} to={this.state.isLogin?"/":"/login"}>{this.state.isLogin?"Log Out":"Log In"}</Link>
              </li>
             
            </ul>
          </div>
        </div>
        <Snackbar 
          open={this.state.open}
          onClose={this.handleClose}
          transitionDuration={2000}
          onEntered={this.handleExit}
          TransitionComponent={TransitionUp}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Hope To See You Soon </span>}
        />
      </nav>
    )
  }
}


export default Navbar;