import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import DynamicPortfolio from './DynamicPortfolio';

// Drop component for PDF resume
function DropResumePage() {
  const navigate = useNavigate();

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Your backend parses PDF and saves sample.json
        const response = await fetch('https://your-api.com/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        // Wait for backend to finish saving
        navigate('/resume');
      } catch (err) {
        alert('Failed to upload: ' + err.message);
      }
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed gray',
        fontSize: '1.5rem',
      }}
    >
      Drop your PDF resume here
    </div>
  );
}

// Resume display page
function ResumePage() {
  return <DynamicPortfolio jsonUrl="/sample.json" />;
}

// App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DropResumePage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
