import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip'
import {Link} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },

});

 class storage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
       <Tooltip title="Back">
          <Link to="/admin/panel/storages">
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <ArrowBack />
            </Fab>
          </Link> 
        </Tooltip>
  
        <h1 className="display-4 text-center">Storage NAME!</h1>
        <hr/>
        <h1>Show Inventories Down Here!</h1>
      </div>
    )
  }
}

storage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(storage);