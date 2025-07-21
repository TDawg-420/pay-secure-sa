import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <h1>PaySecureSA</h1>
        <p className="tagline">Secure International Payments Portal</p>
        <hr />
        <p className="info">
          Welcome to your trusted portal for global transactions.
          Please register or log in to continue.
        </p>
        <div className="buttons">
          <button>Register</button>
          <button className="outline">Login</button>
        </div>
      </div>
    </div>
  );
}

export default App;
