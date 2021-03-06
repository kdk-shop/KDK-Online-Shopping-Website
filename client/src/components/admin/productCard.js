import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'react-router-dom/Link';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
const styles = theme => ({
    card: {
        height: "100%",
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
        height: 60
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

class ProductCard extends Component {

    state = {
        number: 0,
        id: null,
        isDisabled: true
    }
    handleChange = event => {
        this.setState({
            number: parseInt(event.target.value),
            isDisabled: false
        });
    };

    componentWillMount() {
        this.setState({ number: this.props.count, id: this.props.id })
    }
    render() {
        const { classes } = this.props;
        let editlink = '/admin/panel/inventory/edit-product/edit?id=' + this.state.id
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
                    <Grid item style={{ display: "inline-grid" }}>
                        <CardActions>

                            <Grid container justify="space-between" alignItems="center" alignContent="center" >
                                
                                <Grid item xs={6}>
                                    <Link to={editlink} >
                                        <Tooltip title="Edit">
                                            <IconButton aria-label="Edit">
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>

                                </Grid>
                                <Grid item xs={6}>
                                    <Tooltip title="Delete" onClick={() => this.props.handleDelete(this.state.id,)} >
                                        <IconButton >
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

ProductCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCard);
