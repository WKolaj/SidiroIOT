import React, { useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    marginBottom: {
      marginBottom: '100px',
      paddingTop: '100px'
    }
  }
})
)

const isNotObject = (data) => typeof data !== 'object' || data === null;
const isObject = (data) => typeof data === 'object' && data !== null;

//for array of arrays
const notObject = (element) => element.every(isNotObject);

function Row(props) {
  // props.row === ['item1', 'item2', 'item3', ...]
  const [open, setOpen] = React.useState(false);
  const [objects, setObjects] = React.useState(null)
  const classes = useRowStyles();
  const { t } = useTranslation();
  const { row, columns } = props;

  useEffect(() => {
    let obj = []
    row.forEach((cell, index) => {
      if (isObject(cell)) {
        obj.push({ cell: cell, index: index })
      }
    })
    setObjects(obj)
  }, [row])

  useEffect(() => {
    //console.log(objects)
  }, [objects])

  const createCollapsedTable = (entries) => {
    let cols = []
    let rows = []
    for (const [col, properties] of entries) {
      cols.push(col)
      rows.push(properties.toString())
    }
    return {
      rows: rows,
      columns: cols
    }
  }

  return (
    <React.Fragment >
      <TableRow className={classes.root}>
        <TableCell >
          {/* if expand needed - first cell for arrow */}
          {objects !== null && objects.length > 0 ? <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton> : null}
        </TableCell>

        {row.map((cell, index) => {
          return (<TableCell key={index}>{typeof cell === "boolean" || cell === null ? `${cell}` : typeof cell === "object" ?
            (<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>) : cell}</TableCell>)
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={row.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {objects !== null ? objects.map((obj, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography variant="h6" gutterBottom component="div" style={{ marginTop: '20px' }}>
                      {t(`DevicesSelectionPage.Properties.${columns[obj.index]}`)}
                    </Typography>
                    {isObject(Object.entries(obj.cell)[0][1]) && !Array.isArray(obj.cell) ?
                      Object.entries(obj.cell).map((obj, i) => {
                        const tableParams = createCollapsedTable(Object.entries(obj[1]))
                        return (
                          <React.Fragment key={i}>
                            <Typography variant="subtitle2" >{t(`DevicesSelectionPage.Properties.${obj[0]}`) !== `DevicesSelectionPage.Properties.${obj[0]}` ? t(`DevicesSelectionPage.Properties.${obj[0]}`) : obj[0]}</Typography>
                            <Table size="small" aria-label="details" style={{ marginBottom: '10px' }}>
                              <TableHead>
                                <TableRow>
                                  {tableParams.columns.map((col, index) => {
                                    return <TableCell style={{ width: `${100 / tableParams.columns.length}%` }} key={index}>
                                      {t(`DevicesSelectionPage.Properties.${col}`) !== `DevicesSelectionPage.Properties.${col}` ? t(`DevicesSelectionPage.Properties.${col}`) : col}
                                      </TableCell>
                                  })}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  {tableParams.rows.map((row, index) => {
                                    return <TableCell key={index}>{row}</TableCell>
                                  })}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </React.Fragment>
                        )
                      })
                      :
                      Array.isArray(obj.cell) && obj.cell.length > 0 ?
                        <Table size="small" aria-label="details">
                          <TableHead>
                            <TableRow>
                              {Object.keys(obj.cell[0]).map((objKey, i) => {
                                return <TableCell key={i} style={{ width: `${100 / Object.keys(obj.cell).length}%` }}>
                                  {t(`DevicesSelectionPage.Properties.${objKey}`) !== `DevicesSelectionPage.Properties.${objKey}` ? t(`DevicesSelectionPage.Properties.${objKey}`) : objKey}
                                  </TableCell>
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {obj.cell.map((obj, i) => {
                              return (
                                <TableRow key={i}>
                                  {Object.values(obj).map((value,i) => {
                                    return <TableCell key={i}>
                                      {t(`DevicesSelectionPage.Properties.${value}`) !== `DevicesSelectionPage.Properties.${value}` ? t(`DevicesSelectionPage.Properties.${value}`) : value}
                                      </TableCell>
                                  })}
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                        :
                        <Table size="small" aria-label="details">
                          <TableHead>
                            <TableRow>
                              {createCollapsedTable(Object.entries(obj.cell)).columns.map((col, index) => {
                                return <TableCell style={{ width: `${100 / Object.entries(obj.cell).length}%` }} key={index}>{t(`DevicesSelectionPage.Properties.${col}`)}</TableCell>
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              {createCollapsedTable(Object.entries(objects[index].cell)).rows.map((row, index) => {
                                return <TableCell key={index}>{row}</TableCell>
                              })}
                            </TableRow>
                          </TableBody>
                        </Table>}
                  </React.Fragment>
                )
              })
                : null}
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
      {props.row.map((cell, index) => <TableCell key={index}>{typeof cell === "boolean" ? cell.toString() : Array.isArray(cell) ? `[${cell.join(', ')}]` : typeof cell === "object" ? JSON.stringify(cell) : cell}</TableCell>)}
    </TableRow>
  )
}

export default function CollapsibleTable(props) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {/* 1 empty cell in table head if row is to be expanded (contains object) */}
            {props.rows.length > 0 && props.rows.filter(notObject).length < props.rows.length ?
              <TableCell /> : null}
            {props.columns.map((column, index) => {
              return <TableCell style={{ width: `${100 / props.columns.length}%` }} key={index}>{t(`DevicesSelectionPage.Properties.${column}`)}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => {

            return props.rows.filter(notObject).length < props.rows.length ?
              <Row key={index} row={row} columns={props.columns} />
              : <SimpleRow row={row} key={index} />
          }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

