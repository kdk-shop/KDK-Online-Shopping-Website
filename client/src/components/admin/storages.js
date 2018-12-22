import React, { Component } from 'react';
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Pagination from "react-js-pagination";
import {Link} from 'react-router-dom'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit*2,
  },

});

 class storages extends Component {
   constructor(){
     super();
    this.state={
      storages:[],
      maxStorages:'',
      message:'',
      page:1,
      open:false,
      deleted_id:null
    }
   }
   
   componentWillMount(){
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
      axios.get(`/api/storages/?pagesize=12&page=${this.state.page}`)
      .then(res=>{
        console.log(res)
        this.setState({
          storages:res.data.storages,
          maxStorages:res.data.maxStorages,
          message:res.data.message

        })
      })
      .catch(err=>{
        this.setState({message:err.response.data.message})
    })
   }
   handlePageChange = (pageNumber)=>{
    this.setState({page:pageNumber})
    axios.get(`/api/storages/?pagesize=12&page=${pageNumber}`)
    .then(res=>{
        console.log(res)
        this.setState({
          storages:res.data.storages,
          maxStorages:res.data.maxStorages,
          message:res.data.message
        })
    })
    .catch(err=>{
        this.setState({message:err.response.data.message})
    })
  }

  handleDelete=()=>{
    axios.delete(`/api/storages/delete/${this.state.deleted_id}`)
    .then(()=>{
      window.location ='/admin/panel/storages'
    })
    this.setState({ open: false,deleted_id: null });
  
  }

  handleClickOpen = (id) => {
    this.setState({ open: true,deleted_id: id});
  };

  handleClose = () => {
    this.setState({ open: false,deleted_id: null });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    
                </Typography>
                </Toolbar>
            </AppBar>
          <Tooltip title="Back">
            <Link to="/admin/panel">
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <ArrowBack />
              </Fab>
            </Link> 
          </Tooltip>
          <Tooltip title="Add" >
            <Link to="/admin/panel/storages/add-storage">
              <Fab color="primary" aria-label="Add" className={classes.fab}>
              <AddIcon />
              </Fab>
            </Link>
          </Tooltip>
          <h1 className="display-4 text-center">All Storages</h1>
            <hr/>
            <Grid container spacing={24} style={{dispaly: "block",margin: "0 auto"}}>
                {this.state.storages.map((item)=>{
                    let link = '/admin/panel/storage?id='+item._id
                    let editlink = '/admin/panel/storages/edit?id='+item._id
                    return(<Grid item key={item._id}  xs={6} >

                            <List >
                              <ListItem>
                              <Link to={link} style={{ textDecoration: 'none' }}>
                                <ListItemText>
                                    <Typography>{item.name}</Typography>
                                    <Typography>{item.address}</Typography>
                                </ListItemText>
                                </Link>
                                <ListItemSecondaryAction>
                                  <Link to={editlink} >
                                    <Tooltip title="Edit">
                                    <IconButton aria-label="Edit">
                                      <Edit />
                                    </IconButton>
                                    </Tooltip>
                                  </Link>
                                  <Tooltip title="Delete" >
                                  <IconButton onClick={()=>this.handleClickOpen(item._id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                              </ListItem>
                             </List>
                        <hr/>                        
                    </Grid>)
                })}
            </Grid>
            <div>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Are you sure to delete?"}</DialogTitle>
              <DialogActions>
                <Button onClick={this.handleDelete} color="primary">
                  Yes
                </Button>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            </div>
        <Pagination
        style={{visibility:(this.state.storages.length === 0?"hidden":"visible")}}
        activePage={this.state.page}
        itemsCountPerPage={12}
        totalItemsCount={this.state.maxStorages}
        pageRangeDisplayed={5}
        onChange={this.handlePageChange}
          />
    </div>
    )
  }
}
storages.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(storages);