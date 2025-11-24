import React from 'react';
import { BrowserRouter } from 'react-router';

import { Toaster } from "react-hot-toast";
import MainComponents from './Components/MainComponents';


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
