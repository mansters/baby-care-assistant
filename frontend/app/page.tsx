import * as React from 'react';
import { getFeedingLogs } from '@/lib/api-client';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

export default async function Dashboard() {
  const logs = await getFeedingLogs();

  return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🍼 BabyCare Dashboard
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.feedingTime), 'yyyy-MM-dd HH:mm')}
                    </TableCell>

                    <TableCell>
                      <Chip label={log.type} color="primary" size="small" />
                    </TableCell>

                    <TableCell>
                      {log.durationMinutes > 0 ? `${log.durationMinutes} mins` : '-'}
                    </TableCell>

                    <TableCell>
                      {log.amountMl > 0 ? `${log.amountMl} ml` : '-'}
                    </TableCell>
                  </TableRow>
              ))}

              {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No logs found. Start tracking!</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
}