import React, { Component } from 'react';
import './App.css';

import ChessBoard from './components/ChessBoard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chess Engine</h1>
        </header>
        <div className='appBody'>
            <ChessBoard/>
        </div>
      </div>
    );
  }
}

export default App;
