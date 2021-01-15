import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
  const { row, collapsedContent } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className={classes.expandArrow}>
          {collapsedContent !== null && collapsedContent !== undefined ?
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
            <Collapse in={open} timeout="auto" unmountOnExit>
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

export default function CollapsibleTable({ columns, rows, collapsedRows }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {columns.map((col, i) => <TableCell style={{ width: `${100 / columns.length}%` }} key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            const rowContainsCollapsedContainer = collapsedRows.filter(collapsedRow => collapsedRow.rowIndex === i)
            return (<Row key={row} row={row} collapsedContent={rowContainsCollapsedContainer.length !== 0 ? rowContainsCollapsedContainer[0].content : null} />)
          })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}