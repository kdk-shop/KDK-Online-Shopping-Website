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

class editStorage extends Component {
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
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
    onSubmit(e){
        e.preventDefault();
        const updateStorage={
            name:this.state.name,
            address:this.state.address
        }
        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
        axios.post('/api/storages/update/:storage_id',updateStorage)
        .then(res=>{
            this.setState({open:true , errors:''})          
        })
        .catch(err=>this.setState({errors:err.response.data}))
    }
    componentWillMount(){
        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
        axios.get('/api/storages/update/:storage_id')
               .then(res=>{
                 this.setState({
                  name:res.data.name,
                  address:res.data.address,
                 })
               })
               .catch(err=>{
                 this.setState({errors:err.response.data})
                })
      }
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
export default editStorage;