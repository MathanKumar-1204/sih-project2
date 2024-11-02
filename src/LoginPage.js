import React, { useState } from 'react';
import './LoginPage.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import { database } from './firebase'; // Import the initialized database
import { ref, get, child } from "firebase/database"; // Import specific functions from 'firebase/database'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create a reference to the 'login' path in your Firebase Realtime Database
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `login/${username}`));
            
            if (snapshot.exists()) {
                const userPassword = snapshot.val();
                if (userPassword === password) {
                    // Password matches, redirect to the next page
                    navigate('/lang'); // Adjust the path as necessary
                } else {
                    // Password does not match
                    setError('Incorrect password');
                }
            } else {
                // User does not exist
                setError('Username does not exist');
            }
        } catch (error) {
            console.error('Error checking login credentials:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="creds">
                <form className="form" id="loginForm" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    {error && <p className="error">{error}</p>}
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="pwd">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your Password"
                        id="pwd"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="abc" type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <a href="/register"><button className="abc">Register</button></a>
                </p>
            </div>
            <div className="logo">
                <h1>ILT</h1>
                <p>Indian Language Translator</p>
            </div>
        </div>
    );
};

export default LoginPage;
