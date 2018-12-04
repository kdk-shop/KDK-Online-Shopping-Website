import React, { Component } from 'react';

import Card from './card';
import Grid from '@material-ui/core/Grid'


class Products extends Component{
   
    render(){
        
        return(
            <Grid container spacing={24} style={{dispaly: "block",margin: "0 auto"}}>
           
                <Grid item  xs={12} sm={6} md={4} >
                    <Card image='https://xcdn.next.co.uk/common/Items/Default/Default/Publications/G67/shotview-315x472/2240/548-896s.jpg' brand='Brand' price='10' title='Title' rate={5} available={true} />
                </Grid>
                <Grid item  xs={12} sm={6} md={4}>
                    <Card image='https://xcdn.next.co.uk/common/Items/Default/Default/Publications/G67/shotview-315x472/2240/548-896s.jpg' brand='Brand' price='10' title='Title' rate={5} available={true} />
                </Grid>
                <Grid item  xs={12} sm={6} md={4}>
                    <Card image='https://xcdn.next.co.uk/common/Items/Default/Default/Publications/G67/shotview-315x472/2240/548-896s.jpg' brand='Brand' price='10' title='Title' rate={5} available={true} />
                </Grid>
                <Grid item  xs={12} sm={6} md={4}>
                    <Card image='https://xcdn.next.co.uk/common/Items/Default/Default/Publications/G67/shotview-315x472/2240/548-896s.jpg' brand='Brand' price='10' title='Title' rate={5} available={true} />
                </Grid>
            </Grid>

            
        )
    }
}
export default Products;