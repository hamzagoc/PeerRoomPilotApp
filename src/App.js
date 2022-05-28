import React from 'react';
import './App.css';
import ExampleRoom from './ExampleRoom/ExampleRoom';
import DashBoard from './Game/BoardGame/Dixit/pages/Dashboard';
import 'antd/dist/antd.min.css';

function App() {

  return (
    <div className="App">
      <DashBoard />
    </div>
  );
}

export default App;
