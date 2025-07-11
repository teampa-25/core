import express from 'express';

const app = express();
const API_PORT = process.env.API_PORT || 3000;


app.listen(API_PORT, () => {
  console.log(`Server running at http://localhost:${API_PORT}`);
});

app.get('/', (req, res) => {
  res.send('API is running (dev mode)');
});



