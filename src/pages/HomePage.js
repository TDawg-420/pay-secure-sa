import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function HomePage() {
    return (
        <div className="app-container">
            <h1>Welcome to PaySecureSA</h1>
            <p>Please choose an option below to get started.</p>
            <div className="buttons">
                <Link to="/register">
                    <button>Register</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
}
