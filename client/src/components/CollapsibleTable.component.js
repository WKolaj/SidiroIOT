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

const isNotObject = (data) => typeof data !== 'object' || data === null;
const isObject = (data) => typeof data === 'object' && data !== null;

function Row(props) {
  // props.row === ['item1', 'item2', 'item3', ...]
  const [open, setOpen] = React.useState(false);
  const [objects, setObjects] = React.useState(null)
  const classes = useRowStyles();
  const { row, columns } = props;

  React.useEffect(() => {
    let obj = []
    row.map((cell, index) => {
      return isObject(cell) ? obj.push({ cell: cell, index: index }) : null
    })
    setObjects(obj)
  }, [row])

  const createCollapsedTable = (entries) => {
    let cols = []
    let rows = []
    for (const [col, properties] of entries) {
      cols.push(col)
      rows.push(JSON.stringify(properties))
    }
    return {
      rows: rows,
      columns: cols
    }
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {row.map((cell, index) => {
          return <TableCell key={index}>{typeof cell === "boolean" ? cell.toString() : typeof cell === "object" ? 
          (<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>) : cell}</TableCell>
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={row.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {objects !== null ? objects.map((obj, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography variant="h6" gutterBottom component="div" style={{marginTop:'20px'}}>
                      {columns[obj.index]}
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          {createCollapsedTable(Object.entries(obj.cell)).columns.map((col, index) => {
                            return <TableCell key={index}>{col}</TableCell>
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {createCollapsedTable(Object.entries(objects[index].cell)).rows.map((row) => {
                            return <TableCell key={row}>{row}</TableCell>
                          })}
                          </TableRow>
                      </TableBody>
                    </Table>
                  </React.Fragment>

                )
              }) : null}
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
          {props.row.map((cell, index) => <TableCell key={index}>{typeof cell === "boolean" ? cell.toString() : typeof cell === "object" ? JSON.stringify(cell) : cell}</TableCell>)}
        </TableRow>
  )
}

export default function CollapsibleTable(props) {
  return (
      <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {props.rows.map((row, index) => {
                  if (!row.every(isNotObject)) {
                    return <TableCell key={index} />
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
                  return <Row key={index} row={row} columns={props.columns} />
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
  );
}

