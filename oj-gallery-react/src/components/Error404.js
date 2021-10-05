import * as React from 'react';
import { Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function Error404() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '90vh',
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 10, mb: 2 }} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          {'Error 404 - Page Not Found'}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'We believe you have landed here with right mind, but we do not have anything here for you.'}
        </Typography>
        <Typography variant="body1"><Link to="/">Click here to navigate to home page</Link> </Typography>
      </Container>
    </Box>
  );
}