import React,{useState} from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import DynamicPortfolio from './DynamicPortfolio';

// Drop component for PDF resume
function DropResumePage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') return alert('Please upload a PDF');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await fetch('https://your-api.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      navigate('/resume');
    } catch (err) {
      alert('Failed to upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleFile(file);
  };

  return (
    <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDrop}
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    }}
  >
      <div
      style={{
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        width: '300px',
        textAlign: 'center',
      }}
    >
        <h2 style={{ color: '#007bff', marginBottom: '1rem' }}>Upload New PDF</h2>
        <label
          htmlFor="fileInput"
          style={{
            display: 'block',
            border: '2px dashed #007bff',
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#007bff',
            marginBottom: '1rem',
          }}
        >
          <span role="img" aria-label="upload" style={{ fontSize: '1.5rem' }}>📤</span> CHOOSE PDF FILE
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={() => handleFile(selectedFile)}
          disabled={!selectedFile || uploading}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: selectedFile ? '#007bff' : '#ccc',
            color: 'white',
            fontWeight: 'bold',
            cursor: selectedFile ? 'pointer' : 'not-allowed',
          }}
        >
          {uploading ? 'Uploading...' : 'UPLOAD PDF'}
        </button>
      </div>
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
