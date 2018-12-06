import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import SimpleGrow from './Grow';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width:'100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: "60vw",
  },
 
});

function Comment(props) {

  // const handleSend = ()=>{
  //   axios.get("api/products/review/:product_id/:user_id")
  //       .then(res=>{
  //           console.log(res)
  //           this.setState({
  //              products:res.data.products,
  //              maxProducts:res.data.maxProducts,
  //              message:res.data.message
  //           })
  //       })
  //       .catch(err=>{
  //           this.setState({message:err.response.data.message})
  //       })
  // }
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={16}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                 Comments
                </Typography>
              </Grid>
              {props.comments.map((x)=>{
                return(
                  <Grid item key={x.review} >
                <TextField 
                    disabled={true}
                      id="filled-multiline-static"
                      label={x.creatorId}
                      multiline
                      rows="4"
                      defaultValue={x.review}
                      className={classes.textField}
                      margin="normal"
                      variant="filled"
                      />
              </Grid>
                )
                
              })}
               {/* <Grid item >
                        <TextField
                    id="filled-multiline-static"
                    label="new comment"
                    multiline
                    rows="4"
                    defaultValue="Default Value"
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    />
            </Grid> */}
            </Grid>
           
          </Grid>
        </Grid>
        {/* <Button variant="contained" color="primary" >
        Send
      </Button> */}
      </Paper>
      
    </div>
  );
}

Comment.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comment);


