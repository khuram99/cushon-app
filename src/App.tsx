import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "./components";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: "100%",
          height: "100%",
        },
        body: {
          width: "100%",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        },
        "#root": {
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
