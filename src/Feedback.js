import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feedback.css';
function Feedback() {
  const navigate = useNavigate();
    
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback Submitted:', formData);
    setSubmitted(true);
    // You can also send the formData to a server or backend here
  };
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (<div>
    <nav>
  <div className="navbar">
  <ul className="navbar-list">
          <li className="navbar-item" onClick={() => handleNavigation('/lang')}>HOME</li>
          <li className="navbar-item" onClick={() => handleNavigation('/downloads')}>DOWNLOAD</li>
          <li className="navbar-item" onClick={() => handleNavigation('/feedback')}>FEEDBACK</li>
          <li className="navbar-item" onClick={() => handleNavigation('/')}>LOGOUT</li>
        </ul>
  </div>
</nav>
    <div class ='n' style={{ maxWidth: '600px', padding: '20px' }}>
        
      <h1>Feedback Form</h1>
      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <h2>Thank you for your feedback!</h2>
          <p>We appreciate your input.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
              rows="5"
            ></textarea>
          </div>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Submit Feedback
          </button>
        </form>
      )}
    </div></div>
  );
}

export default Feedback;
