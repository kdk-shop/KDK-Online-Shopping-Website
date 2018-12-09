import React, { Component } from 'react'
import { Zoom } from 'react-slideshow-image';
 
const images = [
  'https://gds-storage-prd.s3.amazonaws.com/unified-gallery/151217/6285/26642249/thumbnails/iphone-6-plus-rose-gold-black-background-3500-3500.jpg',
  'http://demo.themerelic.com/ostore-pro/wp-content/uploads/2018/09/goldgenie-iphone-6-3.jpg',
  'https://www.iclarified.com/images/news/33822/139872/139872.jpg',
];
 
const zoomOutProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  scale: 0.5,
  arrows: false
}
 
export default class slideshow extends Component {
  render() {
    return (
      <div>
         <Zoom {...zoomOutProperties} >
        {
          images.map((each, index) => <img alt={index} key={index} style={{width: "100%"}} src={each} />)
        }
      </Zoom>
      </div>
    )
  }
}
