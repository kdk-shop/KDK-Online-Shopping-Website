import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

class Navbar extends Component {

  state = {
    isLogin: false
  }
  componentDidMount(){
    console.log(localStorage.getItem("jwt_token"))
    if(localStorage.getItem("jwt_token")){
      this.setState({isLogin:true})
    }else{
      this.setState({isLogin:false})
    }
  }

  logout = (event)=>{
    if(this.state.isLogin){
      localStorage.removeItem("jwt_token")
      axios.get('/api/users/logout')
         .then(res=>{
           this.setState({isLogin:false})
         })
         .catch(err=>console.log(err))
    }
  }
  render() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">Home</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
              </li>
            </ul>
    
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={this.state.isLogin?"/profile":"/register"}>{this.state.isLogin?"Profile":"Sign Up"}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" onClick={this.logout} to={this.state.isLogin?"/":"/login"}>{this.state.isLogin?"Log Out":"Log In"}</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;