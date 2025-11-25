import React from 'react';
import { BrowserRouter } from 'react-router';
import MainComponents from './Components/MainComponents';
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <MainComponents />
      </BrowserRouter>
    </div>
  );
}

export default App;
