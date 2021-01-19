import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { setCollapsibleTableInstance } from '../actions/CollapsibleTable.action';

const useRowStyles = makeStyles({
  expandArrow: {
    maxWidth: '50px'
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row, collapsedContent, rowInstance, rowName, setCollapsibleTableInstance } = props;
  const classes = useRowStyles();

  useEffect(() => {
    if (rowInstance[rowName] === undefined) {
      setCollapsibleTableInstance(rowName, false)
    }
  }, [rowName, setCollapsibleTableInstance, rowInstance])


  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className={classes.expandArrow}>
          {collapsedContent !== null && collapsedContent !== undefined ?
            <IconButton aria-label="expand row" size="small" onClick={() => setCollapsibleTableInstance(rowName, !rowInstance[rowName])}>
              {rowInstance[rowName] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            : null}
        </TableCell>
        {row.map((cell, i) => {
          return (
            <TableCell key={i}>
              {cell}
            </TableCell>
          )
        })}
      </TableRow>
      {collapsedContent !== null && collapsedContent !== undefined ?
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={row.length + 1}>
            <Collapse in={rowInstance[rowName]} timeout="auto" unmountOnExit>
              <Box margin={1}>
                {collapsedContent}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        :
        null}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    rowInstance: state.CollapsibleTableReducer
  }
}

const mapDispatchToProps = {
  setCollapsibleTableInstance
}

export default connect(mapStateToProps, mapDispatchToProps)(Row)