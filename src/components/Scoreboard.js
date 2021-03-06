import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Scoreboard() {
  const data = useLocalStorageHook();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const sortedPlayers = data.getAllPlayers();
    sortedPlayers.sort(function (a, b) {
      return b.score - a.score;
    });
    setPlayers(sortedPlayers);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Players ranking #</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Level</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((row, index) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.level}</StyledTableCell>
              <StyledTableCell>{row.score}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
