import React, { Component } from 'react'
import { Wave,Random} from 'react-animated-text';
import SwipeableTextMobileStepper from '../products/steper';

import Grid from '@material-ui/core/Grid'
import '../../style.css';

class Landing extends Component {
  render() {
    return (
      <div>
        <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                
                <h1 className="display-3 mb-4"> <Wave text="KDK Online Shopping Store" /></h1>
                <p className="lead"> We simply aspire to provide high quality, well-designed essentials for the right price</p>
                <hr />
              </div>
            </div>           
          </div>
        
        </div>
      </div>
      <div className="temp">
      s,d
      </div>
      <div className="section1">
            <div className="row">
              <div className="col-md-3 text-center"> </div>
                <div className="col-md-6 text-center">
                {/* <SwipeableTextMobileStepper/> */}
              
                </div>
                <div className="col-md-3 text-center"> </div>
              
              </div>
          </div> 
      </div>
        
        
    )
  }
}

export default Landing;