import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
 
  badge: {
    top: 1,
    right: -15,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'dark' ? '#2b2f35' : '#2b2f35'
    }`,
  },
  icon:{
    color:'#b9bfc9'
  }
});

class Navbar extends Component {

  state = {
    isLogin: false,
    open:false,
    cart:[],
  }

  componentWillMount(){
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    
    axios.get(`/api/carts/`)
    .then(res=>{
      console.log(res.data)
      this.setState({
          cart:res.data.cart,
      })
    })
    .catch(err=>{
      console.log(err)
    })
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
  onClick=()=>{
    window.location="/cart"
  }
  
  render() {
    const { classes } = this.props;
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
              {this.state.isLogin? <li className="nav-item">
              <IconButton aria-label="Cart" onClick={this.onClick} style={{outline: 'none'}}>
                <Badge badgeContent={this.state.cart.length} color="primary" classes={{ badge: classes.badge }}>
                  <ShoppingCartIcon className={ classes.icon }/>
                </Badge>
              </IconButton>
              </li>:''}
             
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

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
