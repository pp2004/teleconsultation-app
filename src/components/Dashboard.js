// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h2>Teleconsultation Dashboard</h2>
      <p>Welcome to the teleconsultation platform.</p>
      <Link to="/videochat">
        <button>Start Video Consultation</button>
      </Link>
    </div>
  );
};

export default Dashboard;
