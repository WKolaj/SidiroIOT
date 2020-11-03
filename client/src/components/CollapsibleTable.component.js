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
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {props.row.map((cell, index) => {
          console.log(cell)
          return typeof cell !== 'object' ? <TableCell key={index}>{cell}</TableCell> : <TableCell key={index}>{JSON.stringify}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={props.row.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                lol
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function SimpleRow(props) {
  const classes = useRowStyles();
  return (
    <TableRow className={classes.root}>
      {props.row.map((cell, index) => <TableCell key={index}>{cell}</TableCell>)}
    </TableRow>
  )
}



export default function CollapsibleTable(props) {
  const isNotObject = (data) => typeof data !== 'object';
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {props.rows.map(row => {
              if (!row.every(isNotObject)) {
                return <TableCell />
              }
              return null
            })}
            {props.columns.map((column, index) => {
              return <TableCell key={index}>{column}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => {
            if (row.every(isNotObject)) {
              return <SimpleRow row={row} key={index} />
            }
            else {
              return <Row key={index} row={row} />
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}