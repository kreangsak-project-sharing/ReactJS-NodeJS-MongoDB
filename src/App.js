import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { theme } from "./theme";
import Page01 from "./pages/Page01";
import Page02 from "./pages/Page02";
import Page03 from "./pages/Page03";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/page01" replace />} />
          <Route path="/page01" element={<Page01 />} />
          <Route path="/page02" element={<Page02 />} />
          <Route path="/page03" element={<Page03 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
