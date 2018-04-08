import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css';

import Main from './Components/Statics/Main.jsx'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    );
  }
}

export default App;
