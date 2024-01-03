const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { EventEmitter } = require('events');
const path = require('path');

const port = process.env.PORT || 3000;


// Set up SSE connection
const eventEmitter = new EventEmitter();

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

app.get('/echo', (req, res) => {
  const { query } = req;
  const { input } = query;

  const normal = input || '';
  const shouty = input ? input.toUpperCase() : '';
  const charCount = input ? input.length : 0;
  const backwards = input ? input.split('').reverse().join('') : '';

  res.json({ normal, shouty, charCount, backwards });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/chat', (req, res) => {
    const { message } = req.query;
    eventEmitter.emit('message', message);
    res.sendStatus(200);
  });

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  const messageHandler = (message) => {
    sendMessage(message);
  };

  eventEmitter.on('message', messageHandler);

  res.on('close', () => {
    eventEmitter.off('message', messageHandler);
  });
});

// Route to serve chat.html
app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
