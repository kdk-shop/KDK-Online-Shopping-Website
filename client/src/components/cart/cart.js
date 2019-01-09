import React, { Component } from 'react'
import Card from '../cart/cartCard'
import axios from 'axios'
import Pagination from "react-js-pagination";
import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import RCPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    },
    button: {
      marginRight: theme.spacing.unit,
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    table: {
      minWidth: 700,
    },
  });
  let id = 0;
function createData(name, brand, price, quantity, totalAmount) {
  id += 1;
  return { id, name, brand, price, quantity, totalAmount };
}


function getSteps() {
  return ['Manage your shopping cart', 'Complete your shopping'];
}


class cart extends Component {
  constructor(){
    super();
    this.state={
      cart:[],
      message:'',
      page:1,
      activeStep: 0,
      completed: {},
      open:false,
      openSnackbar:false,

    }
  }
  handleCloseSnack = () => {
    this.setState({ openSnackbar: false });
  };
  
  handleExit = ()=>{
    window.location = "/cart"
  }
  
  handleClose = () => {
    this.setState({ open: false,activeStep:0});
  };
  
  handlePurchase=()=>{
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    
    axios.post('/api/carts/checkout')
    .then((res)=>{
      this.setState({openSnackbar:true,message:res.data.message})
    })
    .catch(err=>{
      console.log(err)
      this.setState({openSnackbar:true,message:err.response.data.message})
    })
    this.setState({ open: false,activeStep:0});
    
  }
  
  componentWillMount(){
    axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
    
    axios.get(`/api/carts/?pagesize=12&page=${this.state.page}`)
    .then(res=>{
      console.log(res.data)
      this.setState({
                    cart:res.data.cart
                })
              })
              
              
            }
            
            handlePageChange = (pageNumber)=>{
              this.setState({page:pageNumber})
              axios.get(`/api/products/?pagesize=12&page=${pageNumber}`)
              .then(res=>{
                // console.log(res)
                this.setState({
                  cart:res.data.cart,
                  message:res.data.message
                })
              })
            }
            
            
            handleChangeQty = (newQty,id)=>{
              const product = {
                productId: id,
                qty: newQty
              }
              let request = axios.create({
                method: 'PATCH',
                baseURL: `/api/carts/`,
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("jwt_token")
                },
              });
             request.patch(null, product)
               .then((res) => {
                 this.setState({ openSnackbar: true ,message:res.data.message})
                  console.log(res)
               }).catch(err =>{
                 this.setState({openSnackbar: true,message:err.response.data.message})
               } )
         
            }
         
            handleStep = step => () => {
              this.setState({
                activeStep: step,
              });
              if(step==1){
                this.setState({open:true})
              }
            };
            
            
  render() {
    const { classes } = this.props;

      let totalQTY=0;
      let totalPrice=0;

      const rows = [
        this.state.cart.map((item)=>{
          return(
            createData(item.product.title, item.product.brand, item.product.price, item.qty,(item.product.price* item.qty))
          )})
      ];
      // {console.log(rows)}
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div style={{height:'100%'}}>
          {this.state.cart==null?'null': 
          <Grid container spacing={24} style={{dispaly: "block",margin: "0 auto"}}>
                    {this.state.cart.map((item)=>{
                        return(
                        <Grid item key={item.product._id}  xs={12} sm={6} md={4}>
                            <Card 
                            productId={item.product._id}
                            image={item.product.imagePaths[0]} 
                            brand={item.product.brand}
                            price={item.product.price}
                            title={item.product.title}
                            qty={item.qty}    
                            changeQty={this.handleChangeQty}    
                            />
                        </Grid>)
                    })}
                </Grid>}
        
       {this.state.cart.length == 0?(<div>
         <h1 style={{marginTop:50,textAlign:"center"}}>Your Cart Is Empty</h1>
       </div>):
       <div>
         <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell>Item</TableCell> */}
            <TableCell>Name</TableCell>
            <TableCell align="right">Brand</TableCell>
            <TableCell align="right">Price($)</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  
          {rows.map(row => {
            return(
              row.map(r=>{
                totalQTY+=r.quantity;
                totalPrice+=r.totalAmount
                return (                  
                  <TableRow key={r.id}>
                    {/* <TableCell component="th" scope="row">
                      {r.id}
                    </TableCell> */}
                    <TableCell component="th" scope="row">
                      {r.name}
                    </TableCell>
                    <TableCell align="right">{r.brand}</TableCell>
                    <TableCell align="right">{r.price}</TableCell>
                    <TableCell align="right">{r.quantity}</TableCell>
                    <TableCell align="right">{r.totalAmount}</TableCell>
                  </TableRow>
                );
              })

            )
          })}
          
          <TableRow style={{backgroundColor:'#c0c3c6',opacity:0.5,color:'black'}}>
            {/* <TableCell></TableCell> */}
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">{totalQTY}</TableCell>
            <TableCell align="right">{totalPrice}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
        <div className={classes.root}>
        <Stepper nonLinear activeStep={activeStep} style={{outline:'none'}}>
          {steps.map((label, index) => {
            return (
              <Step key={label}  style={{outline:'none'}}>
                <StepButton  style={{outline:'none'}}
                  onClick={this.handleStep(index)}
                  completed={this.state.completed[index]}
                  style={{outline:'none'}}
                >
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
          {/* <Pagination
         
          style={{visibility:(this.state.cart.length== 0?"hidden":"visible")}}
           activePage={this.state.page}
           itemsCountPerPage={12}
           totalItemsCount={this.state.cart.length}
           pageRangeDisplayed={5}
           onChange={this.handlePageChange}
            /> */}
             <nav aria-label="...">
                
                <RCPagination style={{marginTop: 50,display:"flex", justifyContent:"center"}} locale="en_US" pageSize={12} current={this.state.page} total={this.state.cart.length} onChange={this.handlePageChange}/>
               </nav>
      </div>
      </div>
       }
        <div>
             <Dialog
               open={this.state.open}
               onClose={this.handleClose}
                style={{width: '150px'}}
  >
               <DialogTitle > {"Total Price  :  "+totalPrice+" ($)"}
            </DialogTitle>
               <DialogTitle > {"Total Quantity  :  "+totalQTY}
            </DialogTitle>
               <DialogContent>
            <DialogContentText>
             
            </DialogContentText>
          </DialogContent>
               <DialogActions>
                 <Button onClick={this.handlePurchase} color="primary" style={{outline:'none'}}>
                   Order
                 </Button>
                 <Button onClick={this.handleClose} color="secondary" autoFocus  style={{outline:'none'}}>
                   Cancel
                 </Button>
               </DialogActions>
             </Dialog>
             </div>
             <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleCloseSnack}
          transitionDuration={2000}
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
cart.propTypes = {
    classes: PropTypes.object,
  };
  
  export default withStyles(styles)(cart);