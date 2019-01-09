import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Storage from '@material-ui/icons/Storage';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListIcon from '@material-ui/icons/List';
import Logout from '@material-ui/icons/PowerSettingsNew';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Chart from './chart'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
const drawerWidth = 260;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    // height:'auto'
    // zIndex: -1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

class panel extends Component {
   state = {
    open:false
  }
  handleClose = () => {
    this.setState({ open: false });
  };

  handleExit = ()=>{
    window.location = "/"
  }
  onClickStorages = ()=>{
    window.location="/admin/panel/storages"
  }
  onClickChangePassword = ()=>{
    window.location="/admin/panel/change-password"
  }
  onClickLogout = ()=>{
      localStorage.removeItem("jwt_token")
      axios.get('/api/users/logout')
         .then(res=>{
           this.setState({open:true})
         })
         .catch(err=>console.log(err))
  }

  onClickProductList = ()=>{
    window.location = '/admin/panel/inventory/product-list'
  }

  onClickAvailability = ()=>{
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    axios.post('/api/products/product_availability')
      .then(res => {
        // console.log('')
      })
      .catch(err => {
        // console.log(err.respones.data.message)
      })
    
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer 
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
            <ListItem button onClick={this.onClickStorages}>
              <ListItemIcon>
                <Storage />
              </ListItemIcon>
              <ListItemText primary='Storages' />
            </ListItem>
            <ListItem button onClick={this.onClickProductList}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary='Products' />
            </ListItem>
            <Divider />
            <ListItem button onClick={this.onClickChangePassword}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary='Change Password' />
            </ListItem>
            <ListItem button onClick={this.onClickLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
        <Divider />
            <ListItem>

          <Button variant="contained" color="secondary" onClick={this.onClickAvailability}>
            Update Availability
        </Button>
            </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Chart></Chart>
      </main>
      <Snackbar 
          open={this.state.open}
          onClose={this.handleClose}
          transitionDuration={2500}
          onEntered={this.handleExit}
          TransitionComponent={TransitionUp}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Goodbye Admin!</span>}
        />
    </div>
    )
  }
}

panel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(panel);
