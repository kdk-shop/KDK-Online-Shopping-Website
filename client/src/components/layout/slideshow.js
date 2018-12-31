import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Link} from 'react-router-dom'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});
 
 class slideshow extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {this.props.products.map(item => (
          <Link to={`/product?id=${item._id}`}>
          <GridListTile key={item._id}>
            <img src={item.imagePaths[0]} alt={item.title} />
            <GridListTileBar
              title={item.title}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              />
          </GridListTile>
              </Link>
        ))}
      </GridList>
    </div>
    )
  }
}

slideshow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(slideshow);