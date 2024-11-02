import React, { useState } from 'react';
import './RegisterPage.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import { database } from './firebase'; // Import the initialized database
import { ref, set, get, child } from "firebase/database"; // Import specific functions from 'firebase/database'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `login/${username}`));
            
            if (snapshot.exists()) {
                // User already exists
                setError('Username already exists!');
            } else {
                // Add user to database
                await set(ref(database, `login/${username}`), password);
                // Redirect to login page or another page after successful registration
                navigate('/');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="creds">
                <form className="form" id="registerForm" onSubmit={handleSubmit}>
                    <h1>Register</h1>
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
                    <label htmlFor="confirmPwd">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm your Password"
                        id="confirmPwd"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="abc" type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <a href="/"><button className="abc">Login</button></a>
                </p>
            </div>
            <div className="logo">
            <h1>ILT</h1>
            <p>Indian Language Translator</p>
            </div>
        </div>
    );
};

export default RegisterPage;
