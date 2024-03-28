
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import PingPongGame from './PingPongGame';
import Tournament from './Tournament';
import Chat from './Chat';
import './css/App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import OnlineGame from './OnlineGame';
import React, { useState, useEffect } from 'react';
import OnlineTournament from './OnlineTournament';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('Token'));
  }, []);

 

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
                <div className="start-page d-flex justify-content-center align-items-center vh-100">
                  <div className="button-container">
                  {isLoggedIn ? (
                      <Link to={`/dashboard/${localStorage.getItem('id')}/`}>
                        <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                          profile
                        </button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                          Login
                        </button>
                      </Link>
                    )}
                    <Link to="/game">
                      <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                        local game
                      </button>
                    </Link>
                    {isLoggedIn && (<Link to="/OnlineGame">
                      <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                        online game
                      </button>
                    </Link>)}
                    <Link to="/tournament">
                      <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                        local tournament
                      </button>
                    </Link>
                    {isLoggedIn && (<Link to="/onlineTournament">
                      <button className="btn btn-primary m-2" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}}>
                        online tournament
                      </button>
                    </Link>)}
                   
                  </div>
                </div>
              </>
            }
          />
          <Route path="/game" element={<PingPongGame />} />
          <Route path='/tournament' element={<Tournament />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/OnlineGame" element={<OnlineGame />} />
          <Route path='/onlineTournament' element={<OnlineTournament />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
