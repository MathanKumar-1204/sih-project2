import React, { useState, useRef } from 'react';
import './Lang.css';
import { useNavigate } from 'react-router-dom';

const indianLanguages = [
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' }
];

function Lang() {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            setLoading(true);
            const timestamp = new Date().toISOString();
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const newAudioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(newAudioUrl);

            const formData = new FormData();
            formData.append('file', audioBlob, `audio_${timestamp}.webm`);

            try {
              const response = await fetch('http://localhost:5000/audio', {
                method: 'POST',
                body: formData
              });
              const data = await response.json();

              if (data.error) {
                console.error(data.error);
                alert('Transcription failed. Please try again.');
              } else {
                setTranscription(data.text);
                setDetectedLanguage(data.language);

                try {
                  const translateResponse = await fetch('http://localhost:5000/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: data.text, target_language: selectedLanguage })
                  });
                  const translateData = await translateResponse.json();

                  if (translateData.error) {
                    console.error(translateData.error);
                    alert('Translation failed. Please try again.');
                  } else {
                    setTranslatedText(translateData.translated_text);
                  }
                } catch (translateError) {
                  console.error('Translation error:', translateError);
                  alert('Translation failed due to an error. Please try again.');
                }
              }
            } catch (error) {
              console.error('Error during transcription:', error);
              alert('Error during transcription. Please try again.');
            } finally {
              setLoading(false);
            }
          };

          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          alert('Error accessing microphone. Please ensure microphone permissions are enabled.');
        });
    } else {
      alert('Browser does not support audio recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <div className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item" onClick={() => handleNavigation('/lang')}>HOME</li>
          <li className="navbar-item" onClick={() => handleNavigation('/downloads')}>DOWNLOAD</li>
          <li className="navbar-item" onClick={() => handleNavigation('/feedback')}>FEEDBACK</li>
          <li className="navbar-item" onClick={() => handleNavigation('/')}>LOGOUT</li>
        </ul>
      </div>
      
      <div className="header">
        <input 
          className="input-language-box" 
          type="text" 
          value={detectedLanguage} 
          readOnly 
          placeholder="Input Language" 
        />
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="language-select"
        >
          {indianLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      
      <div className="row">
        <div className="left">
          <input 
            className="input-box" 
            type="text" 
            value={transcription} 
            readOnly 
            placeholder="Transcribed Text" 
          />
        </div>
        <div className="right">
          <input 
            className="large-input" 
            type="text" 
            value={translatedText} 
            readOnly 
            placeholder="Translated Text" 
          />
        </div>
      </div>

      {!isRecording ? (
        <button className="submit-btn" onClick={handleStartRecording} disabled={loading}>
          {loading ? 'Processing...' : 'Start Recording'}
        </button>
      ) : (
        <button className="submit-btn" onClick={handleStopRecording}>Stop Recording</button>
      )}

      {audioUrl && (
        <div className="audio-player">
          <p>Recorded Audio:</p>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default Lang;
