import React, { Component } from 'react'
import { Wave,Random} from 'react-animated-text';
import SwipeableTextMobileStepper from '../products/steper';
import ComplexGrid from '../products/Media';
import Comment from '../products/comment';
import Grid from '@material-ui/core/Grid'
import '../../style.css';

class Product extends Component {
  render() {
    return (
      <div>
         <h1>product page</h1>
         <ComplexGrid/>
         <br/>
         <Comment/>
      </div>
        
        
    )
  }
}

export default Product;