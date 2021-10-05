import { Container } from '@mui/material';
import Box from '@mui/material/Box';


function Footer() {
  return (
      <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
      {"Copyright © "}
        OJ Gallery {new Date().getFullYear()}
        {"."}
      </Container>
    </Box>
  );
}

export default Footer;
