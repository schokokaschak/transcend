
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import PingPongGame from './PingPongGame';
import Tournament from './Tournament';
import './css/App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('Token'));
  }, []);

  const handleOut = () => {
    localStorage.removeItem('Token'); 
    localStorage.removeItem('id');
    setIsLoggedIn(false);

  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header>
                  <h1>ft_transcendence</h1>
                </header>
                <div className="start-page">
                  <div className="button-container">
                  {isLoggedIn ? (
                      <Link to={`/dashboard/${localStorage.getItem('id')}/`}>
                        <button className="button">
                          Profile
                        </button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <button className="button">
                          Login
                        </button>
                      </Link>
                    )}
                    <Link to="/game">
                      <button className="button">
                        local game
                      </button>
                    </Link>
                    <Link to="/tournament">
                      <button className="button">
                        tournament
                      </button>
                    </Link>
                    <Link to="/">
                      <button className="button">
                        placeholder
                      </button>
                    </Link>
                    <button onClick={handleOut}>Log Out</button>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/game" element={<PingPongGame />} />
		      <Route path='/tournament' element={<Tournament />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
