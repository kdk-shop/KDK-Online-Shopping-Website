import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const styles = theme =>({
    card: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 345,
        margin: "0 auto"
    },
    media: {
        // ⚠️ object-fit is not supported by IE 11.
        objectFit: 'cover',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 50,
        height: 60
    },
    item: {
        flex: 1
    },
    fullHeight: {
        height: "100%"
    }
});

class ImgMediaCard extends Component{

    state ={
        number: 0,
        id:null,
        message: '',
        isDisabled: false
    }
    
    componentWillMount(){
        this.setState({id:this.props.id})
    }

    handleChange = (e)=>{
        if(e.target.value !== '-1'){
            this.setState({ number: parseInt(e.target.value), isDisabled: false})
        }
        
    }

    changeQty(){
        if(this.state.number !== 0){
            axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
            const product = {
                qty: this.state.number,
                productId: this.state.id
            }
            axios.post(`/api/inventories/${window.location.search.substr(4)}`,product)
                .then(res => {
                    console.log(res)
                    
                })
                .catch(err => {
                    this.setState({ message: err.response.data.message })
                })
        }
    }
    render(){
        const { classes } = this.props;
    
        return (
            <Card className={classes.card}>
                <CardActionArea className={classes.item}>

                    <CardContent>
                        <Typography component="h5" variant="h5">
                            {this.props.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {this.props.brand}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container justify="center" alignItems="center" alignContent="center">
                        <Grid item>
                            <TextField
                                id="standard-number"
                                label="Quantity"
                                value={this.state.number}
                                onChange={this.handleChange}
                                type="number"
                                // variant="outlined"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item>
                            <Button disabled={this.state.isDisabled} variant="contained" color="primary" className={classes.button} type="submit" onClick={() => { this.changeQty(this.state.number, this.state.id); this.setState({ isDisabled: true }) }}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                    <div style={{color:"red"}}>{this.state.message === '' ? null:this.state.message}</div>
                </CardActions>
            </Card>
        );
    }
    
}

ImgMediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImgMediaCard);
