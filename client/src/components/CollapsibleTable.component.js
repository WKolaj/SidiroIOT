import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CollapsedRow from './CollapsedRow.component';

export function CollapsibleTable({ columns, rows, collapsedRows, name }) {
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
            return (<CollapsedRow rowName={`${name}-${i}`} key={row} row={row} collapsedContent={rowContainsCollapsedContainer.length !== 0 ? rowContainsCollapsedContainer[0].content : null} />)
          })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}