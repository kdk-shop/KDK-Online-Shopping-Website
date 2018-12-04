import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});


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
    const { classes } = this.props;
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
            <li className="nave-item">
            <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
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
        <Snackbar bodyStyle={{ backgroundColor: 'white', color: 'coral' }}
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


export default withStyles(styles)(Navbar);