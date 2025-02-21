const express = require('express');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// Basic test endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Endpoint to handle audio transcription
app.post('/transcribe', (req, res) => {
  const audioFile = path.resolve(__dirname, req.query.file || 'test_audio.wav');

  const pythonProcess = execFile('python', [
    path.join(__dirname, 'transcribe.py'), 
    audioFile
  ]);

  let transcription = '';

  pythonProcess.stdout.on('data', (data) => {
    transcription += data.toString();
    console.log('Transcription progress:', data.toString());
  });

  pythonProcess.on('error', (error) => {
    console.error(`Python Error: ${error}`);
    res.status(500).send('Transcription failed');
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Complete transcription:', transcription);
      res.json({ transcription });
    } else {
      res.status(500).send('Transcription failed');
    }
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
