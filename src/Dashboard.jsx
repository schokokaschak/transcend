import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';
/* eslint-disable */
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // Zustand für Benutzerdaten
  let { id } = useParams();
  const navigate = useNavigate();

  function fetchUserData() {
    const backendURL = 'http://localhost:8000/users/';
    const userId = localStorage.getItem('id');
  
    if (!userId) {
      console.error('Benutzer-ID nicht im localStorage gefunden');
      return;
    }
  
    const requestURL = `${backendURL}${userId}/`;
  
    fetch(requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('Token')}` // Include the token in the Authorization header
      },
    })
    .then(response => response.json())
    .then(data => {
      setUserData(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  useEffect(() => {
    const backendURL = 'http://localhost:8000/users/';
    const userId = localStorage.getItem('id');
    

    if (!userId) {
      console.error('Benutzer-ID nicht im localStorage gefunden');
      return;
    }

    const requestURL = `${backendURL}${id}/`;

    fetch(requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('Token')}` // Include the token in the Authorization header
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    })
    .then(data => {
      setUserData(data); // Benutzerdaten im Zustand speichern
    })
    .catch(error => {
      console.error('Fehler beim Senden der Registrierungsdaten:', error);
      alert(error.message);
    });
  }, [id]);

  function addFriend() {
    fetch('http://localhost:8000/friend-requests/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('Token')}` // Include the token in the Authorization header
      },
      body: JSON.stringify({
        'from_user': parseInt(localStorage.getItem('id'), 10),
        'to_user': userData.id,
      }),
    })
    .then(response => response.json())
    .then(data => {
      fetchUserData();  
      console.log('Success:', data);
      console.log(localStorage.getItem('id'));
      console.log(localStorage.getItem('Token'));
      console.log(userData.id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function acceptFriendRequest(requestId) {


    fetch(`http://localhost:8000/friend-requests/${requestId}/accept/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application  /json',   
        'Authorization': `Token ${localStorage.getItem('Token')}` // Include the token in the Authorization header  
      },  
    })
    fetchUserData();

    // Send a request to the backend to accept the friend request
    // Then fetch the userData again to update the list of friend requests
  }
  const handleBack = () => {
  
     
      navigate('/'); // Navigiere zur Startseite, wenn der "Zurück"-Button geklickt wird
    };
  
    const handleOut= () => {
      localStorage.removeItem('Token'); 
      localStorage.removeItem('id');
      navigate('/'); // Navigiere zur Startseite, wenn der "Zurück"-Button geklickt wird
    };
  return (
    <div className="container mt-5">
      {userData ? (
        <>
          {userData.profile.is_current_user && <h1>Welcome to your profile, {userData.username}</h1>}
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={userData.profile.image} />
            <Card.Body>
              <Card.Title>{userData.username}</Card.Title>
              <Card.Text>
                Email: {userData.email}
              </Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>Games Won: {userData.profile.games_won}</ListGroup.Item>
              <ListGroup.Item>Games Lost: {userData.profile.games_lost}</ListGroup.Item>
            </ListGroup>

            <Card.Body>
              Friends:
              <ul>
              {userData.profile.friends.map((friend, index) => (
                <li key={index}>
                  <a href={`/dashboard/${friend.id}`}>{friend.username}</a>
                </li>
              ))}
            </ul>
              {!userData.profile.is_current_user && !userData.profile.already_sent_request && <button onClick={addFriend}>Add Friend</button>}
              {userData.profile.is_current_user && <div>Friend Requests:
            <ul>
              {userData.profile.to_user.map((request, index) => (
                <li key={index}>
                  {request.from_user_username}
                  <button onClick={() => acceptFriendRequest(request.id)}>Accept</button>
                </li>
              ))}
            </ul></div>}
            </Card.Body>
          </Card>
          <button onClick={handleBack}>Back to menu</button>
          <button onClick={handleOut}>Log Out</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );}

export default Dashboard;
