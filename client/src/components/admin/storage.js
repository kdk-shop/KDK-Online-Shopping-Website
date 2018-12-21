import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Edit from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip'
import {Link} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
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
        <Tooltip title="Edit Storage">
          <Link to="/admin/panel/storage/edit-storage">
            <Fab color="secondary" aria-label="Edit" className={classes.fab}>
              <Edit/>
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