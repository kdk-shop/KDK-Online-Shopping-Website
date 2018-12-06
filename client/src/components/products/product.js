import React, { Component } from 'react'
import { Wave,Random} from 'react-animated-text';
import ComplexGrid from '../products/Media';
import Comment from '../products/comment';
import axios from 'axios'
import Button from '@material-ui/core/Button';

class Product extends Component {

  state = {
    product : null

  }
  componentWillMount(){
    axios.get(`/api/products/${this.props.location.search.substr(4)}`)
        .then(res=>{
            console.log(res.data)
            this.setState({product:res.data})
        })
        .catch(err=>{
            // this.setState({message:err.response.data.message})
        })
  }
  render() {
    console.log(this.props.location.search.substr(4))
    if(this.state.product !== null){

      console.log(this.state.product.reviews)
    }
    return (
        this.state.product === null?null:(<div>
          <h1></h1>
          <ComplexGrid
          brand = {this.state.product.brand}
          title = {this.state.product.title}
          image = {this.state.product.imagePaths[0]}
          price = {this.state.product.price}
          description= {this.state.product.description}
          />
          <br/>
          <Comment comments={this.state.product.reviews}/>
          
       </div>)
      
        
        
    )
  }
}

export default Product;