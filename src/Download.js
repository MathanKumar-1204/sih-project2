import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Download = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Function to fetch transcribed and translated texts from the backend
  const fetchTexts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/texts');
      const data = await response.json();
      setTranscribedText(data.transcribedText);
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Error fetching texts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch texts on component mount
  useEffect(() => {
    fetchTexts();
  }, []);

  const downloadFile = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item" onClick={() => handleNavigation('/lang')}>HOME</li>
          <li className="navbar-item" onClick={() => handleNavigation('/downloads')}>DOWNLOAD</li>
          <li className="navbar-item" onClick={() => handleNavigation('/feedback')}>FEEDBACK</li>
          <li className="navbar-item" onClick={() => handleNavigation('/')}>LOGOUT</li>
        </ul>
      </nav>

      <div className="b">
        <button onClick={fetchTexts} disabled={loading} id='b'>
          {loading ? 'Loading...' : 'Fetch Texts'}
        </button>
        <button id='b'
          onClick={() => downloadFile(transcribedText, 'transcribed_text.txt')}
          disabled={!transcribedText}
        >
          Download Transcribed Text
        </button>
        <button id='b'
          onClick={() => downloadFile(translatedText, 'translated_text.txt')}
          disabled={!translatedText}
        >
          Download Translated Text
        </button>
      </div>
    </div>
  );
};

export default Download;
