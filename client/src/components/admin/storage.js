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
     console.log(`going to change the qty to ${newQty} for ${id}`)
   }

  render() {
    const { classes } = this.props;
    return (
      <div>
       <Tooltip title="Back">
          <Link to="/admin/panel/storages">
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <ArrowBack />
            </Fab>
          </Link> 
        </Tooltip>
        <Tooltip title="Add" >
          <Link to="#">
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <AddIcon />
            </Fab>
          </Link>
        </Tooltip>
        <h1 className="display-4 text-center">{this.state.name}</h1>
        <hr/>
        <Grid container spacing={24} style={{ dispaly: "block", margin: "0 auto" }}>
          {this.state.products.map((item) => {
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
                  />
            </Grid>)
          })}
        </Grid>
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={12}
          totalItemsCount={this.state.maxProducts}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </div>
    )
  }
}

storage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(storage);