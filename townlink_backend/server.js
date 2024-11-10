const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
const { spawn } = require('child_process');

app.use(cors());
app.use(express.json());

app.post('/query', (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res.status(400).json({ error: 'Query parameter is missing.' });
  }

  const pythonProcess = spawn('python3', ['rag.py', userQuery]);

  let dataToSend = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    dataToSend += data.toString('utf8');
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString('utf8');
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      console.error(`Error output: ${errorData}`);
      res.status(500).json({ error: 'Error occurred in the AI service.' });
    } else {
      try {
        const response = JSON.parse(dataToSend);
        res.json(response);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ error: 'Error parsing AI response.' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

