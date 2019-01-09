import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip'
import {Link} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack';
import Card from '../admin/inventoryCard';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Pagination from "react-js-pagination";
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';

import RCPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  card: {
    height: "100%"
  },

});

 class storage extends Component {
  state = {
    products:[],
    maxProducts: '',
    message:'',
    name:'',
    page: 1,
    open: false,
    deleted_id: null,
    openS: false
  }

  componentWillMount(){
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
    axios.get(`/api/inventories/${this.props.location.search.substr(4)}/?pagesize=12`)
      .then(res => {
        this.setState({
          products: res.data.inventory,
          maxProducts: res.data.maxProducts,
          message: res.data.message,
          name: res.data.storage
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ message: err.response.data.message })
      })
  }

   handlePageChange = (pageNumber) => {
     this.setState({ page: pageNumber })
     axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
     axios.get(`/api/inventories/${this.props.location.search.substr(4)}/?pagesize=12&page=${pageNumber}`)
       .then(res => {
         // console.log(res)
         this.setState({
           products: res.data.inventory,
           maxProducts: res.data.maxProducts,
           message: res.data.message
         })
       })
       .catch(err => {
         this.setState({ message: err.response.data.message })
       })
   }


   handleChangeQty = (newQty,id)=>{
     const product = {
       productId: id,
       qty: newQty
     }
     let request = axios.create({
       method: 'PATCH',
       baseURL: `/api/inventories/${window.location.search.substr(4)}`,
       headers: {
         Authorization: "Bearer " + localStorage.getItem("jwt_token")
       },
     });
    request.patch(null, product)
      .then(() => {
        this.setState({ openS: true })

        // window.location = '/admin/panel/storage?id=' + window.location.search.substr(4);
      }).catch(err => console.log(err))

   }

   handleDelete = () => {
     const product = {
       productId: this.state.deleted_id
     }
     
     axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
     axios.delete(`/api/inventories/${window.location.search.substr(4)}`,{data:product})
       .then(() => {
         window.location = '/admin/panel/storage?id=' + window.location.search.substr(4);
       })
       .catch(err=>console.log(err))
     this.setState({ open: false, deleted_id: null });

   }

   handleClickOpen = (id) => {
     this.setState({ open: true, deleted_id: id });
   };

   handleCloseDelete = () => {
     this.setState({ open: false, deleted_id: null });
   };

   handleClose = () => {
     this.setState({ openS: false });
   };

   handleCloses = ()=>{
     this.setState({ openS: false });
   }
  render() {
    const { classes } = this.props;
    let addLink = "/admin/panel/inventory/add?id="+this.props.location.search.substr(4)
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    Inventories List
                </Typography>
                </Toolbar>
            </AppBar>
       <Tooltip title="Back">
          <Link to="/admin/panel/storages">
            <Fab color="primary" aria-label="Back" className={classes.fab}>
              <ArrowBack />
            </Fab>
          </Link> 
        </Tooltip>
        <Tooltip title="Add" >
          <Link to={addLink}>
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <AddIcon />
            </Fab>
          </Link>
        </Tooltip>
        {/* <h1 className="display-4 text-center"></h1> */}
        <hr/>
        <Grid container spacing={24} style={{ dispaly: "block", margin: "0 auto" }}>
          {this.state.products.map((item) => {
              // console.log(item)
            if (item.product) {
              return (<Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card 
                      style={{height:"100%"}}
                      className={classes.card}
                      id={item.product._id}
                      image={item.product.imagePaths[0]}
                      brand={item.product.brand}
                      price={item.product.price}
                      title={item.product.title}
                      count={item.qty}
                      changeQty={this.handleChangeQty}
                      onDelete={this.handleClickOpen}
                    />
              </Grid>)
            }
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
              <Button onClick={this.handleCloseDelete} color="primary" autoFocus>
                No
                </Button>
            </DialogActions>
          </Dialog>
          <nav aria-label="...">
                
                <RCPagination style={{marginTop: 50,display:"flex", justifyContent:"center"}} locale="en_US" pageSize={12} current={this.state.page} total={this.state.maxProducts} onChange={this.handlePageChange}/>
               </nav>
          <Snackbar
            open={this.state.openS}
            onClose={this.handleCloses}
            transitionDuration={2500}
            onEntered={this.handleCloses}
            TransitionComponent={TransitionUp}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Your changes have been made</span>}
          />
        </div>
      </div>
    )
  }
}

storage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(storage);