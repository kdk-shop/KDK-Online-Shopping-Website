import React, { Component } from 'react'
import { Wave } from 'react-animated-text';
import SlideShow from '../layout/slideshow'
import axios from 'axios'
import {Link} from 'react-router-dom'

class Landing extends Component {
  state={
    RecentProducts:[],
    AmazingProducts:[],
    RecentProductsMessage:'',
    AmazingProductsMessage:''
  }
  componentWillMount(){
    axios.get('/api/products/recent')
     .then(res=>{
       // console.log(res)
       this.setState({RecentProducts:res.data.products,RecentProductsMessage:res.data.message})
     })
     .catch(err=>{
       console.log(err)
     })

    axios.get('/api/products/amazing')
     .then(res=>{
       // console.log(res)
       this.setState({AmazingProducts:res.data.products,AmazingProductsMessage:res.data.message})
     })
     .catch(err=>{
       console.log(err)
     })
  }
  render() {
  
    return (
      <div>
        <div className="landing">
         <div className="dark-overlay landing-inner text-light">
            <div className="container">
             <div className="row">
               <div className="col-md-12 text-center">               
                <h1 className="display-3 mb-4">KDK Online Shopping Store</h1>
                <h6 className="lead">
                  <Wave text="We simply aspire to provide high quality, well-designed essentials for the right price" 
                      speed={40}
                      effect="verticalFadeIn"
                      effectDirection="left"
                      iterations={1}
                  /> 
                </h6>
                <hr/>
               </div>
              </div>           
           </div>
         </div>
         </div>
         <div>
           <hr/>
           <br/>
           Recent Products
           
         <SlideShow 
         products={this.state.RecentProducts}
         message={this.state.RecentProductsMessage}
         />
         <hr/>
          Amazing Products
         <SlideShow 
         products={this.state.AmazingProducts}
         message={this.state.AmazingProductsMessage}
         />
        </div>
      </div>
    )
  }
}

export default Landing;