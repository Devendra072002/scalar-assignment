import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import MentorDropdown from './Components/MentorDropDown';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h4>  Evaluation Dashboard for Mentor</h4>
        </header>
        <Routes>
          <Route path="/" element={<MentorDropdown />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
