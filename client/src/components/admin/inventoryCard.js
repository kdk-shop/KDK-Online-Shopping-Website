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
        width: 50,
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

class InventoryCard extends Component{

    state = {
        number:0,
        id:null,
        isDisabled: true
    }
    handleChange = event => {
        if(event.target.value !== "-1"){
            this.setState({
                number: parseInt(event.target.value),
                isDisabled: false
            });
        }
    };

    componentWillMount(){
        this.setState({number:this.props.count,id:this.props.id})
    }
    render(){
        const { classes } = this.props;
        // console.log(props.available)
        return (
            <Card className={classes.card}>
                <Grid container direction="column" justify="space-evenly" className={classes.fullHeight}>
                    <Grid item className={classes.item} >
                        <CardActionArea className={classes.fullHeight}>
                            <CardMedia
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
                        </CardActionArea>
                    </Grid>
                    <Grid item style={{ display: "inline-grid"}}>
                        <CardActions>
                            
                            <Grid container justify="space-between" alignItems="center" alignContent="center" >
                                <Grid item xs={8}>
                                    <Grid container justify="center" alignItems="center" alignContent="center">
                                        <Grid item>
                                            <TextField
                                                id="standard-number"
                                                label="Quantity"
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
                                            <Button disabled={this.state.isDisabled} variant="contained" color="primary" className={classes.button} type="submit" onClick={() => { this.props.changeQty(this.state.number, this.state.id); this.setState({ isDisabled: true }) }}>
                                                Change
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <Tooltip title="Delete" >
                                        <IconButton onClick={()=>this.props.onDelete(this.state.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            
                        </CardActions>
                    </Grid>
                </Grid>
            </Card>
        );
    }
    
}

InventoryCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InventoryCard);
