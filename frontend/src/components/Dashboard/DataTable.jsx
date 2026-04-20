import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Button from './Button';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  loading = false,
  emptyText = 'No data found',
}) => {
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 8, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Loading…
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
            {(onEdit || onDelete) ? <TableCell align="right">Actions</TableCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {!data.length ? (
            <TableRow>
              <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    {emptyText}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={row._id || idx}
                hover
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {(onEdit || onDelete) ? (
                  <TableCell align="right">
                    <Box sx={{ display: 'inline-flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {onEdit ? (
                        <Button onClick={() => onEdit(row)} variant="secondary" size="sm">
                          {editLabel}
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <Button onClick={() => onDelete(row._id)} variant="danger" size="sm">
                          {deleteLabel}
                        </Button>
                      ) : null}
                    </Box>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
