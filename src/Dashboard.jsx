import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';
/* eslint-disable */
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // Zustand für Benutzerdaten
  let { id } = useParams();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    image: '',
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (userData) {
      setNewProfileData({
        image: userData.profile.image,
        username: userData.username,
        email: userData.email,
        password: '',
      });
    }
  }, [userData]);

  const handleProfileDataChange = (event) => {
    if (event.target.name === 'image') {
      setNewProfileData({
        ...newProfileData,
        [event.target.name]: event.target.files[0],
      });
    } else {
      setNewProfileData({
        ...newProfileData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleProfileUpdate = () => {
    const formData = new FormData();
    for (const key in newProfileData) {
      if (newProfileData[key] !== '') {
        formData.append(key, newProfileData[key]);
      }
    }
  
    fetch(`http://localhost:8000/users/${userData.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${localStorage.getItem('Token')}`,
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setUserData(data);
          setIsEditingProfile(false);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error:', error.message);
      });
  };

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
      
      console.log('Success:', data);
      console.log(localStorage.getItem('id'));
      console.log(localStorage.getItem('Token'));
      console.log(userData.id);
      window.location.reload();
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
    window.location.reload();


    // Send a request to the backend to accept the friend request
    // Then fetch the userData again to update the list of friend requests
  }
  const handleBack = () => {
  
     
      navigate('/'); // Navigiere zur Startseite, wenn der "Zurück"-Button geklickt wird
      window.location.reload();
    };
  
    const handleOut = () => {
      localStorage.removeItem('Token'); 
      localStorage.removeItem('id');
      navigate('/'); // Navigiere zur Startseite, wenn der "Zurück"-Button geklickt wird
      window.location.reload();
    };

    const changeProfil = () => {
      if (isEditingProfile) {
        setIsEditingProfile(false);
        return;
      }
      setIsEditingProfile(true);
    };

    const handleChat = () => {
      navigate(`/Chat`);
    };
    
  return (
    <div className="container mt-5">
      {userData && !isEditingProfile ? (
        <>
          <Card style={{ width: '24rem', paddingTop: '14rem'}}>
            <Card.Img variant="top" src={userData.profile.image} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
            <Card.Body>
              <Card.Title>{userData.username}</Card.Title>
              {userData.profile.is_online ? 'Online' : 'Offline'}
              <Card.Text>
                Email: {userData.email} <br />
                Games Won: {userData.profile.games_won} Games Lost: {userData.profile.games_lost}
              </Card.Text>
            </Card.Body>
            Friends:
            <Card.Body style={{ overflow: 'auto', maxHeight: '200px'}}>
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
              Game History
              <Card.Body style={{ overflow: 'auto', maxHeight: '100px', display: 'flex', flexDirection: 'column' }}>
              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                {userData.profile.games.map((game, index) => (
                  <li key={index} style={{ flex: 1, width: '100%' }}>
                    {new Date(game.created).toLocaleString()} | vs {game.opponent_username} | {game.p1_score} : {game.p2_score} {game.is_winner ? 'won' : 'lost'}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
          {userData.profile.is_current_user && <div> <button className="btn btn-primary m-1" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}} onClick={changeProfil}>edit profile</button></div>}
          <button className="btn btn-primary m-1" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}} onClick={handleChat}>chat</button>
          <button className="btn btn-primary m-1" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}} onClick={handleBack}>back to menu</button>
          <button className="btn btn-primary m-1" style={{width: '18rem', height: '2rem', backgroundColor: '#000000', color: '#ffffff'}} onClick={handleOut}>log out</button>
        </>
        
      ) : (
        <div className="container">
        <form>
          <div className="mb-3">
            <label className="form-label">Choose your new profile picture</label>
            <input type="file" className="form-control" name="image" onChange={handleProfileDataChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" value={newProfileData.username} onChange={handleProfileDataChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={newProfileData.email} onChange={handleProfileDataChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={newProfileData.password} onChange={handleProfileDataChange} />
          </div>
          <button className="btn btn-primary mb-2" style={{ height:'30px', backgroundColor: '#000000', color: '#ffffff'}} onClick={handleProfileUpdate}>update profile</button>
         
          <button className="btn btn-secondary mb-2" style={{ height:'30px', backgroundColor: '#000000', color: '#ffffff'}} onClick={changeProfil}>cancel</button>
        </form>
      </div>
      )}
    </div>
  );}

export default Dashboard;
