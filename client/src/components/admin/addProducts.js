import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import axios from 'axios'

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
      },
  });


class addProducts extends Component {
    constructor(){
        super();
        this.state = {
            title: '',
            price: '',
            description: '',
            category: '',
            brand: '',
            available:false,
            errors:{},
            checkedA: true,
            checkedB: true,
          };
          this.onChange=this.onChange.bind(this);
          this.onSubmit=this.onSubmit.bind(this);
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
     onSubmit(e){
        e.preventDefault();
        const product={
            title:this.state.title,
            price:this.state.price,
            description:this.state.description,
            category:this.state.category,
            brand:this.state.brand,
            available:this.state.available
            
        }
        axios.post('/api/products/create/',product)
            .then(res=>{
                console.log("donzo!")
            })
            .catch(err=>this.setState({errors:err.response.data}))

     }
      handleSwitch = name => event => {
        this.setState({ [name]: event.target.checked });
      };
    
    
      render() {
        const { classes } = this.props;
        return (
          <div>
          <p>Add new Product</p>
          <form className={classes.container} noValidate autoComplete="off" onSubmit={this.onSubmit}>
            <TextField
              label="Title"
              className={classes.textField}
              value={this.state.title}
              margin="normal"
              variant="outlined"
              onChange={this.onChange}
              name="title"
            />
            <TextField
              label="Category"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.category}
              onChange={this.onChange}
              name="category"
            />
            <TextField
            label="Brand"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={this.state.brand}
            onChange={this.onChange}
            name="brand"
            />
            <TextField
              label="Price"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.price}
              onChange={this.onChange}
              name="price"
            />
            <div>
            <br/>
            <Tooltip title="Availablity">
            <Switch
            checked={this.state.checkedB}
            onChange={this.handleSwitch('checkedB')}
            value="checkedB"
            color="primary"
            // value={this.state.available}
            />
            </Tooltip>

            </div>
            <TextField
              label="Description"
              multiline
              rowsMax="4"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              fullWidth
              value={this.state.description}
              onChange={this.onChange}
              name="description"
            />
             <Button variant="contained" color="primary" className={classes.button} type="submit">
                Add 
            </Button>
             <Button variant="contained" color="secondary" className={classes.button}>
                Cancel
            </Button>
            
          </form>
          </div>
        );
      }
    }
    
    export default withStyles(styles)(addProducts);