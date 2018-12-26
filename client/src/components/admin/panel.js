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
    height:'88.89vh', //need to change!!!
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
              <ListItemText primary='Product' />
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
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
          <Button variant="contained" color="primary" onClick={this.onClickAvailability}>
            Update Availability
        </Button>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
          imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
          arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
          donec massa sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
          consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
          vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
          hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
          tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
          nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
          accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
          consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
          vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
          hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
          tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
          nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
          accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </main>
      <Snackbar 
          open={this.state.open}
          onClose={this.handleClose}
          transitionDuration={2000}
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
