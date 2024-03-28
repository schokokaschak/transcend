import React from 'react';
import { Button } from 'react-bootstrap';
/* eslint-disable */
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const Tournament = ({ hasTournament }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigiere zur Startseite, wenn der "Zurück"-Button geklickt wird
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        {hasTournament ? (
          <>
            <Button variant="primary" size="lg" className="mb-3 style={{ height:'30px', backgroundColor: '#000000', color: '#ffffff'}}">
              continue tournament
            </Button>
            <br />
          </>
        ) : null}
        <Button variant="primary" size="lg" style={{ height:'30px', backgroundColor: '#000000', color: '#ffffff'}}>
          new tournament
        </Button>
        <Button variant="primary" size="lg" style={{ height:'30px', backgroundColor: '#000000', color: '#ffffff'}} onClick={handleBack}>
          back to manu
        </Button>
      </div>
    </div>
  );
};

export default Tournament;