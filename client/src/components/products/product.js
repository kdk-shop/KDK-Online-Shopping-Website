import React, { Component } from 'react'
import Media from '../products/Media';
import Comments from '../products/comments';
import axios from 'axios'

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
   
    return (
        this.state.product === null?null:(
        <div>
          <Media
          id={this.state.product._id}
          brand = {this.state.product.brand}
          title = {this.state.product.title}
          image = {this.state.product.imagePaths[0]}
          price = {this.state.product.price}
          discounted = {this.state.product.discountedPrice?this.state.product.discountedPrice:''}
          description= {this.state.product.description}
          available= {this.state.product.available}
          reviews={this.state.product.reviews}
          />
          <br/>
          <Comments comments={this.state.product}/>
         
       </div>
       )
    )
  }
}

export default Product;