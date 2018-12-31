import React, { Component } from 'react'
import { Wave } from 'react-animated-text';
import SlideShow from '../layout/slideshow'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Slider from "react-slick";

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
    console.log(this.state.RecentProducts)
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5
    };
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
           
        </div>

        {/* <hr/>
           <br/>
           Recent Products
           
         <SlideShow 
         products={this.state.RecentProducts}
         message={this.state.RecentProductsMessage}
         />
         <hr/>
          Amazing Offers
         <SlideShow 
         products={this.state.AmazingProducts}
         message={this.state.AmazingProductsMessage}
         /> */}
         <div style={{marginTop:30}}>Recent Products</div>
         
        <div style={{marginTop:50}}>
        <Slider {...settings}>
                {this.state.RecentProducts.map((item)=>{
                  return(
                    <div><Link to={`/product?id=${item._id}`}><img src={item.imagePaths[0]} alt='item'/></Link> </div>
                  )
                })}
                
              </Slider>
        </div>
         <div style={{marginTop:30}}>Amazing Offers</div>
        <div style={{marginTop:50}}>
        <Slider {...settings}>
                {this.state.AmazingProducts.map((item)=>{
                  return(
                    <div><Link to={`/product?id=${item._id}`}><img src={item.imagePaths[0]} alt='item'/> </Link></div>
                  )
                })}
                
              </Slider>
        </div>

      </div>
    )
  }
}

export default Landing;