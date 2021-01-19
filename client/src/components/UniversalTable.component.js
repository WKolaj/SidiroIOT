import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export function UniversalTable({ rows, columns, small = false, noElevation = false }) {
  return (
    <TableContainer component={noElevation ? "div" : Paper}>
      <Table aria-label="simple table" size={small ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell style={{ width: `${100 / columns.length}%` }} key={col}>{col}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow key={i}>
                {row.map((cell, index) => <TableCell key={index}>{cell !== undefined ? cell : ''}</TableCell>
                )}
              </TableRow>
            )
          }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}