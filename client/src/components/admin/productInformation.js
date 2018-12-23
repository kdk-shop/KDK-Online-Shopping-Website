import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import axios from 'axios';
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    input: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 16,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class ProductInformation extends Component{

    state ={
        title: '',
        description:'',
        brand: '',
        category: '',
        price:'',
        image: ''
    }
    
    handleChange = name => event => {
        if(name === 'image'){
            var reader = new FileReader();
            reader.onload = function () {
                var output = document.getElementById('product-image');
                output.src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
            console.log(event.target.files[0])
        }
        this.setState({
            [name]: event.target.value,
        });
    };
    onClick = () => {
        window.location = "/admin/panel"
    } 

    componentDidMount(){
        let id = window.location.search.substr(4);
        if(id){
            axios.get(`/api/products/${id}`)
                .then(res => {
                    console.log(res.data)
                    this.setState({ title: res.data.title,description: res.data.description,brand:res.data.brand,category:res.data.category,price:res.data.price })
                    var output = document.getElementById('product-image');
                    output.src = res.data.imagePaths[0];
                })
                .catch(err => {
                    // this.setState({message:err.response.data.message})
                })
        }else{
            var output = document.getElementById('product-image');
            output.src = "https://cdn11.bigcommerce.com/s-auu4kfi2d9/stencil/59606710-d544-0136-1d6e-61fd63e82e44/e/74686f40-d544-0136-c2c6-0df18b975cb0/icons/icon-no-image.svg";
        }
    }
    render(){
        const { classes } = this.props;
        return(
            <div >
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <img style={{height:"400px",width:"80%"}}id="product-image" alt="product" />
                    </Grid>
                    <Grid item xs={8}>
                        
                        <Grid container justify="space-between">
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="outlined-name"
                                    label="Title"
                                    className={classes.textField}
                                    value={this.state.title}
                                    onChange={this.handleChange('title')}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="outlined-name"
                                    label="Brand"
                                    className={classes.textField}
                                    value={this.state.brand}
                                    onChange={this.handleChange('title')}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="space-between">
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="outlined-name"
                                    label="Category"
                                    className={classes.textField}
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="outlined-name"
                                    label="Price"
                                    className={classes.textField}
                                    value={this.state.price}
                                    onChange={this.handleChange('price')}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>


                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            rowsMax="4"
                            rows="4"
                            value={this.state.description}
                            onChange={this.handleChange('description')}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                        <Grid container>
                            <Grid item>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={this.handleChange('image')} />
                            </Grid>
                        </Grid>

                        
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" className={classes.button} type="submit">
                    Add Product
                </Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClick}>
                    Cancel
                </Button>
                
            </div>
            
        )
    }
}

ProductInformation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductInformation);