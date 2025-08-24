import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuManager from "./components/MenuManager.jsx";
import { useEffect } from "react";
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  useEffect(()=>{
    document.title = "Food Delivery";
  }, []);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <MenuManager/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
