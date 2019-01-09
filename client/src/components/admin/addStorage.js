import React, { Component } from 'react'
import Fab from '@material-ui/core/Fab';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

const styles = theme => ({
    fab: {
      margin: theme.spacing.unit,
    },
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

class addStorage extends Component {
    constructor(){
        super();
       this.state={
         name:'',
         address:'',
         errors:{},
         open:false
       }
       this.onChange=this.onChange.bind(this);
       this.onSubmit=this.onSubmit.bind(this);
      }

      onClick=()=>{
          window.location="/admin/panel/storages"
      }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
    onSubmit(e){
        e.preventDefault();
        const newStorage={
            name:this.state.name,
            address:this.state.address
        }
        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
        axios.post('/api/storages/create',newStorage)
        .then(res=>{
            this.setState({open:true})
        })
        .catch(err=>this.setState({
            errors:err.response.data
        }))
    }
    handleClose = () => {
        this.setState({ open: false });
      };
  
      handleExit = ()=>{
        window.location = "/admin/panel/storages"
      }
  render() {
    const { classes } = this.props;
    return (
      <div>
         <AppBar position="fixed" className={classes.appBar} style={{ background: '#2b2f35' }}>
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    Add Storage
                </Typography>
                </Toolbar>
            </AppBar>
            <Tooltip title="Back">
              <Link to="/admin/panel/storages">
                  <Fab color="primary" aria-label="Add" className={classes.fab}>
                      <ArrowBack />
                  </Fab>
              </Link> 
            </Tooltip>
            <h1 className="display-4 text-center">Add Storage</h1>
            <hr/>
            <div className="col-md-8 m-auto">
              <form className={classes.container} noValidate autoComplete="off" onSubmit={this.onSubmit}>
              <Grid item xs={12}>
                  <TextField
                  fullWidth
                  label="Name"
                  className={classes.textField}
                  value={this.state.name}
                  margin="normal"
                  variant="outlined"
                  onChange={this.onChange}
                  error={this.state.errors.name}
                  helperText={this.state.errors.name === "" ? ' ' :this.state.errors.name }
                  name="name"
                  />
                  <TextField
                  fullWidth
                  label="Address"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  value={this.state.address}
                  onChange={this.onChange}
                  error={this.state.errors.address}
                  helperText={this.state.errors.address === "" ? ' ' :this.state.errors.address }
                  name="address"
                  />
                </Grid>
                <hr/>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="primary" className={classes.button} type="submit">
                      Add 
                  </Button>
              
                  <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClick}>
                      Cancel
                  </Button>
                </Grid>
          </form>
          </div>
          <Snackbar
          open={this.state.open}
          onClose={this.handleClose}
          transitionDuration={1500}
          onEntered={this.handleExit}
          TransitionComponent={TransitionUp}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Storage Added</span>}
        />
      </div>
    )
  }
}

addStorage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(addStorage);