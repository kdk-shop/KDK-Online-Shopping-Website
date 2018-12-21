import React, { Component } from 'react'
import { Wave } from 'react-animated-text';
import SlideShow from '../layout/slideshow'

class Landing extends Component {

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
         <SlideShow />
        </div>
      </div>
    )
  }
}

export default Landing;