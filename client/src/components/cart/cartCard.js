import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios'
import {Link} from 'react-router-dom'

const styles = theme=>({
    card: {
        height:"100%",
        maxWidth: 345,
        margin: "0 auto"
    },
    media: {
        height: 300,
        width: 200,
        margin: "0 auto"
    },
    margin: {
        margin: "0 auto",
        color: "red",

    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 100,
        height:60
    },
    button: {
        margin: theme.spacing.unit,
    },
    item: {
        flex: 1,
    },
    fullHeight: {
        height: "100%"
    }
});

class cartCard extends Component{
    constructor(){
        super();
        this.state = {
            number:1,
            id:null,
            isDisabled: true,
            open:false,
            productId:'',
            openSnack:false
            
        }

    }
    handleChange = event => {
        if(event.target.value !== "0"){
            this.setState({
                number: parseInt(event.target.value),
            });
        }
        // this.state.isDisabled=false
        this.setState({isDisabled:false})
    };

    handleClickOpen = () => {
        this.setState({ open: true});
    };

    handleClose = () => {
        this.setState({ open: false});
    };

    handleDelete=()=>{
        axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("jwt_token");
       
        const product={
            productId:(this.state.productId)
        }
        console.log(product)
        axios.delete('/api/carts/',{data:product})
        .then(()=>{

          window.location ='/cart'
        })
        .catch(err=>{
            console.log(err)
        })
        this.setState({ open: false });
      
    }

    componentWillMount(){
        this.setState({
            number:this.props.qty,
            productId:this.props.productId
        })
       
        
    }

    render(){
        // console.log('qty='+this.state.number+' id='+this.state.productId)
        const { classes } = this.props;
        const link=`/product?id=${this.state.productId}`
        return (
            <div >
            <Card className={classes.card}>
                <Grid container direction="column" justify="space-evenly" className={classes.fullHeight}>
                    <Grid item className={classes.item} >
                        <CardActionArea className={classes.fullHeight}>
                        <Link to={link} style={{textDecoration:'none'}}> <CardMedia
                                className={classes.media}
                                image={this.props.image}
                                title={this.props.title} />
                            
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {this.props.brand} - {this.props.title}
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    <strong>${this.props.price}</strong>
                                </Typography>
                            </CardContent>
                            </Link>
                        </CardActionArea>
                    </Grid>
                    <Grid item style={{ display: "inline-grid"}}>
                        <CardActions>
                            
                            <Grid container justify="space-between" alignItems="center" alignContent="center" >
                                <Grid item  xs={9}>
                                    <Grid container  
                                    justify="center" alignItems="center" alignContent="center">
                                        <Grid item>
                                            <TextField
                                                id="standard-number"
                                                label="Quantity"
                                                // variant="outlined"
                                                value={this.state.number}
                                                onChange={this.handleChange}
                                                type="number"
                                                className={classes.textField}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button disabled={this.state.isDisabled} variant="contained" color="primary" className={classes.button} type="submit" onClick={() => { this.props.changeQty(this.state.number, this.state.productId); this.setState({ isDisabled: true }) }}>
                                                Change
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                
                                <Grid item xs={2}>
                                    <Tooltip title="Delete" >
                                    <IconButton onClick={()=>this.handleClickOpen(this.props.productId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            
                        </CardActions>
                    </Grid>
                </Grid>
            </Card>
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
             </div>
        );
    }
    
}

cartCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(cartCard);
