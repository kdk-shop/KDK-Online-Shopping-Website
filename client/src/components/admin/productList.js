import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip'
import { Link } from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack';
import Card from '../admin/productCard';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Pagination from "react-js-pagination";
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

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
        products: [],
        maxProducts: '',
        message: '',
        name: '',
        page: 1,
        open: false,
        deleted_id: ''
    }

    componentWillMount() {
        axios.get(`/api/products/?pagesize=12`)
            .then(res => {
                this.setState({
                    products: res.data.products,
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
        axios.get(`/api/products/?pagesize=12&page=${pageNumber}`)
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

    handleDelete = ()=>{
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
        axios.delete(`/api/products/delete/${this.state.deleted_id}`)
            .then(() => {
                window.location = '/admin/panel/inventory/product-list'
            })
            .catch(err => console.log(err))
        this.setState({ open: false, deleted_id: null });
    }

    handleClickOpen = (id) => {
        this.setState({ open: true, deleted_id: id });
    };

    handleClose = () => {
        this.setState({ open: false, deleted_id: null });
    };


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Tooltip title="Back">
                    <Link to="/admin/panel">
                        <Fab color="primary" aria-label="Add" className={classes.fab}>
                            <ArrowBack />
                        </Fab>
                    </Link>
                </Tooltip>
                <Tooltip title="Add" >
                    <Link to="/admin/panel/inventory/add-product">
                        <Fab color="primary" aria-label="Add" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                </Tooltip>
                <h1 className="display-4 text-center">{this.state.name}</h1>
                <hr />
                <Grid container spacing={24} style={{ dispaly: "block", margin: "0 auto" }}>
                    {this.state.products.map((item) => {
                        if(item){
                            return (<Grid item key={item._id} xs={12} sm={6} md={4}>
                                <Card
                                    style={{ height: "100%" }}
                                    className={classes.card}
                                    id={item._id}
                                    image={item.imagePaths[0]}
                                    brand={item.brand}
                                    price={item.price}
                                    title={item.title}
                                    handleDelete={this.handleClickOpen}
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
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                No
                </Button>
                        </DialogActions>
                    </Dialog>
                </div>
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