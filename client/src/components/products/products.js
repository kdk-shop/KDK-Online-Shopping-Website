import React, { Component } from 'react';
import axios from 'axios'
import Card from './card';
import Grid from '@material-ui/core/Grid'
import Pagination from "react-js-pagination";
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import {Link} from 'react-router-dom'


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
      backgroundColor: fade(theme.palette.common.white,0.15),
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

class Products extends Component{
    constructor(){
        super();
        this.state={
            products:[],
            maxProducts:'',
            message:'',
            page:1,
            open:false
        };
      }

      componentWillMount(){
          axios.get(`/api/products/?pagesize=12&page=${this.state.page}`)
            .then(res=>{
                console.log(res)
                this.setState({
                   products:res.data.products,
                   maxProducts:res.data.maxProducts,
                   message:res.data.message
                })
            })
            .catch(err=>{
                this.setState({message:err.response.data.message})
            })
      }

      handleSearch = (event)=>{
        if (event.key === 'Enter') {
          // console.log(event.target.value)
          let text = event.target.value
          axios.get(`/api/products/?pagesize=12&page=1&search=${text}`)
          .then(res=>{
              // console.log(res)
              this.setState({
                 products:res.data.products,
                 maxProducts:res.data.maxProducts,
                 message:res.data.message
              })
          })
          .catch(err=>{
              this.setState({message:err.response.data.message,products:[],open:true})
          })
        }
      }
      handlePageChange = (pageNumber)=>{
        this.setState({page:pageNumber})
        axios.get(`/api/products/?pagesize=12&page=${pageNumber}`)
        .then(res=>{
            // console.log(res)
            this.setState({
               products:res.data.products,
               maxProducts:res.data.maxProducts,
               message:res.data.message
            })
        })
        .catch(err=>{
            this.setState({message:err.response.data.message})
        })
      }
      handleClose = () => {
        this.setState({ open: false });
      };
  
      handleExit = ()=>{
        
      }
    render(){
        const { classes } = this.props;
        // console.log(this.state.products.length)
        return(
            <div>
                <div className={classes.grow} />
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                <SearchIcon />
                </div>
                <InputBase
                onKeyPress={this.handleSearch}
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                />
            </div>
                <Grid container spacing={24} style={{dispaly: "block",margin: "0 auto"}}>
                    {this.state.products.map((item)=>{
                        let link = '/product?id='+item._id
                        return(<Grid item key={item._id}  xs={12} sm={6} md={4}>
                            <Link to={link} style={{ textDecoration: 'none' }}>
                            <Card 
                            image={item.imagePaths[0]} 
                            brand={item.brand}
                            price={item.price}
                            title={item.title}
                            rate={item.rating} 
                            available={item.available} />
                            </Link>
                           
                        </Grid>)
                    })}
                </Grid>

                <Pagination
                style={{visibility:(this.state.products.length === 0?"hidden":"visible")}}
                activePage={this.state.page}
                itemsCountPerPage={12}
                totalItemsCount={this.state.maxProducts}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
                 />

                 <Snackbar 
                  open={this.state.open}
                  onClose={this.handleClose}
                  transitionDuration={1500}
                  onEntered={this.handleExit}
                  TransitionComponent={TransitionUp}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{this.state.message}</span>}
                 />
            </div>

            
        )
    }
}
export default withStyles(styles)(Products);