import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip'
import { Link } from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack';

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
        image: null,
        edit:false,
        type:'',
        errors:{}
    }
    
    handleChange = name => event => {
    
        this.setState({
            [name]: event.target.value,
        });
    };

    handleImage = (event)=>{
        this.setState({ image: event.target.files[0], type: event.target.files[0].type.split('/')[1]})
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('product-image');
            output.src = reader.result;
        };
        console.log(event.target.files[0])
        reader.readAsDataURL(event.target.files[0]);
       

        console.log(event.target.files[0])
    }
    onClick = () => {
        window.location = "/admin/panel"
    } 

    componentDidMount(){
        let id = window.location.search.substr(4);
        if(id){
            axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
            axios.get(`/api/products/${id}`)
                .then(res => {
                    console.log(res.data)
                    this.setState({ edit:true,title: res.data.title,description: res.data.description,brand:res.data.brand,category:res.data.category,price:res.data.price })
                    var output = document.getElementById('product-image');
                    output.src = res.data.imagePaths[0];
                })
                .catch(err=>this.setState({errors:err.response.data}))
        }else{
            var output = document.getElementById('product-image');
            output.src = "https://cdn11.bigcommerce.com/s-auu4kfi2d9/stencil/59606710-d544-0136-1d6e-61fd63e82e44/e/74686f40-d544-0136-c2c6-0df18b975cb0/icons/icon-no-image.svg";
        }
    }

    handleClick = ()=>{
        if(this.state.edit){
            if(this.state.image){
                const form = new FormData();
                form.append('image', this.state.image, this.state.title + '.' + this.state.type)
                form.set('title', this.state.title)
                form.set('price', this.state.price)
                form.set('description', this.state.description)
                form.set('category', this.state.category)
                form.set('brand', this.state.brand)
                axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
                axios.put(`/api/products/update/${window.location.search.substr(4)}`, form)
                    .then((res) => {
                        window.location = '/admin/panel/inventory/product-list';
                    })
                    .catch(err=>this.setState({errors:err.response.data}))
            }else{
                let data = {
                    title: this.state.title,
                    price: this.state.price,
                    description: this.state.description,
                    category: this.state.category,
                    brand: this.state.brand
                }
                axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
                axios.put(`/api/products/update/${window.location.search.substr(4)}`, data)
                    .then((res) => {
                        window.location = '/admin/panel/inventory/product-list';
                    })
                    .catch(err=>this.setState({errors:err.response.data}))
            }
            
        
        }else{
            const form = new FormData();
            form.append('image', this.state.image, this.state.title +'.'+ this.state.type)
            form.set('title', this.state.title)
            form.set('price', this.state.price)
            form.set('description', this.state.description)
            form.set('category', this.state.category)
            form.set('brand', this.state.brand)
            console.log(this.state.image)
            axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("jwt_token");
            axios.post('/api/products/create/',form)
            .then((res)=>{
                window.location = '/admin/panel/inventory/product-list';
            })
            .catch(err=>this.setState({errors:err.response.data}))
        }
    }
    render(){
        const { classes } = this.props;
        return(
            <div >
                <Tooltip title="Back">
                    <Link to="/admin/panel/inventory/product-list">
                        <Fab color="primary" aria-label="Add" className={classes.fab}>
                            <ArrowBack />
                        </Fab>
                    </Link>
                </Tooltip>
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
                                    error={this.state.errors.title}
                                    helperText={this.state.errors.title === "" ? ' ' :this.state.errors.title }
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="outlined-name"
                                    label="Brand"
                                    className={classes.textField}
                                    value={this.state.brand}
                                    onChange={this.handleChange('brand')}
                                    margin="normal"
                                    variant="outlined"
                                    error={this.state.errors.brand}
                                    helperText={this.state.errors.brand === "" ? ' ' :this.state.errors.brand }
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
                                    error={this.state.errors.category}
                                    helperText={this.state.errors.category === "" ? ' ' :this.state.errors.category }
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
                                    onChange={this.handleImage} />
                            </Grid>
                        </Grid>

                        
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick} type="submit">
                    {this.state.edit?"Change Information":"Add Product"}
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